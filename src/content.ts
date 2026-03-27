// FloatVid – Content Script
// Handles: video scanning, hover overlay button, PiP logic, site-specific fixes

import type { ExtMessage, ExtResponse, UserSettings } from './types';
import { DEFAULT_SETTINGS } from './types';

// ─── State ────────────────────────────────────────────────────────────────────

let settings: UserSettings = { ...DEFAULT_SETTINGS };
const ATTR = 'data-fv-attached';

// Access the shared PipExt utilities (loaded from pip-shared.js)
declare global {
    interface Window {
        PipExt: any;
    }
}

// ─── Load user settings ───────────────────────────────────────────────────────

chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
    settings = stored as UserSettings;

    // Initialize shared utilities after they're loaded
    const initShared = () => {
        if (window.PipExt) {
            window.PipExt.setupMessageListener(getBestVideo);
            window.PipExt.setupAutoPip(getBestVideo);
            // Set initial PiP state
            window.PipExt.active = !!document.pictureInPictureElement;
            window.PipExt.updateButton();
        }
    };

    // Try immediately, or wait a bit for pip-shared.js to load
    initShared();
    setTimeout(initShared, 100);

    scanVideos();
});

chrome.storage.onChanged.addListener((changes) => {
    for (const key in changes) {
        (settings as unknown as Record<string, unknown>)[key] = changes[key]?.newValue;
    }
    // Re-attach with new position if needed
    document.querySelectorAll<HTMLVideoElement>(`video[${ATTR}]`).forEach((v) => {
        v.removeAttribute(ATTR);
    });
    document.querySelectorAll<HTMLElement>('.fv-btn').forEach((b) => b.remove());
    scanVideos();
});

// ─── Overlay Button ─────────────────────────────────────────────────────────--

const POSITION_STYLES: Record<UserSettings['overlayPosition'], string> = {
    'top-right': 'top:10px; right:10px;',
    'top-left': 'top:10px; left:10px;',
    'bottom-right': 'bottom:10px; right:10px;',
    'bottom-left': 'bottom:10px; left:10px;',
};

function createOverlayButton(video: HTMLVideoElement): HTMLButtonElement {
    // Use the shared PipExt button creation utilities
    const btn = window.PipExt.createButton('fv-btn');
    btn.title = 'Float this video (FloatVid)';

    const pos = POSITION_STYLES[settings.overlayPosition];
    btn.style.cssText = `
    position:absolute; ${pos}
    z-index:2147483647;
    width:36px; height:36px; padding:6px;
    background:rgba(0,0,0,0.72);
    color:#fff; border:none; border-radius:7px;
    cursor:pointer; display:flex;
    align-items:center; justify-content:center;
    opacity:0; transition:opacity .18s ease, transform .12s ease;
    pointer-events:auto;
    backdrop-filter:blur(4px);
    box-shadow:0 2px 8px rgba(0,0,0,.4);
  `;

    btn.addEventListener('mouseenter', () => (btn.style.transform = 'scale(1.1)'));
    btn.addEventListener('mouseleave', () => (btn.style.transform = 'scale(1)'));

    btn.addEventListener('click', (e: MouseEvent) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        window.PipExt.toggle(video);
    });

    return btn;
}

function attachButton(video: HTMLVideoElement): void {
    if (!settings.showOverlayButton) return;
    if (video.hasAttribute(ATTR)) return;

    // Skip tiny / hidden videos
    const rect = video.getBoundingClientRect();
    if (rect.width < 100 || rect.height < 60) return;

    video.setAttribute(ATTR, 'true');

    // Use shared PipExt utilities to attach listeners
    window.PipExt.attachListeners(video);

    const container = video.parentElement;
    if (!container) return;

    if (getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
    }

    const btn = createOverlayButton(video);
    container.appendChild(btn);

    // Show/hide on hover
    const show = (): void => { btn.style.opacity = '1'; };
    const hide = (): void => { btn.style.opacity = '0'; };
    container.addEventListener('mouseenter', show);
    container.addEventListener('mouseleave', hide);

    // Cleanup when video is removed
    new MutationObserver((_, obs) => {
        if (!document.contains(video)) {
            btn.remove();
            container.removeEventListener('mouseenter', show);
            container.removeEventListener('mouseleave', hide);
            obs.disconnect();
        }
    }).observe(document.documentElement, { childList: true, subtree: true });
}

// ─── PiP Core ─────────────────────────────────────────────────────────────────

async function togglePiP(target?: HTMLVideoElement): Promise<void> {
    // Exit if already active
    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        showToast('✕ Exited floating mode');
        return;
    }

    const video = target ?? getBestVideo();
    if (!video) {
        showToast('⚠️ No video found on this page');
        return;
    }

    if (video.disablePictureInPicture) {
        showToast('🚫 PiP is disabled on this video');
        return;
    }

    if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
        showToast('⏳ Video not ready yet — try again in a moment');
        return;
    }

    // Site-specific pre-flight fixes
    applyPlatformFix(video);

    try {
        await video.requestPictureInPicture();
        showToast('▶ Video is now floating!', 1800);
    } catch (err) {
        await handlePiPError(err, video);
    }
}

async function handlePiPError(err: unknown, video: HTMLVideoElement): Promise<void> {
    const e = err as DOMException;

    if (e.name === 'NotAllowedError') {
        // Browser requires a real user-gesture on the video.
        // Nudge: try to play, then request PiP.
        try {
            await video.play();
            await video.requestPictureInPicture();
            showToast('▶ Video is now floating!', 1800);
        } catch {
            showToast('🚫 Click the video once, then try again');
        }
    } else if (e.name === 'NotSupportedError') {
        showToast('❌ PiP not supported on this video');
    } else {
        showToast(`❌ ${e.message}`);
    }
}

// ─── Platform-specific fixes ──────────────────────────────────────────────────

function applyPlatformFix(video: HTMLVideoElement): void {
    const host = location.hostname;

    if (host.includes('youtube.com')) {
        // YouTube sometimes sets disablePictureInPicture via JS policy;
        // we monkey-patch the setter to allow PiP for this session.
        try {
            Object.defineProperty(video, 'disablePictureInPicture', {
                get: () => false,
                configurable: true,
            });
        } catch { /* ignore */ }
        // Pause YouTube's own PiP interceptor
        const ytMovie = document.querySelector<HTMLElement>('.html5-video-player');
        if (ytMovie) ytMovie.dispatchEvent(new Event('pip-request', { bubbles: true }));
    }

    if (host.includes('netflix.com')) {
        // Netflix uses EME; just make sure we don't call play() unnecessarily
        // as it can trigger DRM errors
    }
}

// ─── Smart video selection ────────────────────────────────────────────────────

function getBestVideo(): HTMLVideoElement | null {
    const all = Array.from(document.querySelectorAll<HTMLVideoElement>('video'));
    if (!all.length) return null;

    const visible = all.filter((v) => {
        const r = v.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
    });

    const playing = visible.filter((v) => !v.paused && !v.ended && v.readyState >= 2);
    const pool = playing.length ? playing : visible.length ? visible : all;

    return pool.sort(
        (a, b) =>
            b.getBoundingClientRect().width * b.getBoundingClientRect().height -
            a.getBoundingClientRect().width * a.getBoundingClientRect().height
    )[0] ?? null;
}

// ─── Toast notification ───────────────────────────────────────────────────────

function showToast(msg: string, ms = 3000): void {
    document.getElementById('fv-toast')?.remove();

    const t = document.createElement('div');
    t.id = 'fv-toast';
    t.textContent = msg;
    t.style.cssText = `
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    background:rgba(20,20,20,.9); color:#fff;
    padding:10px 20px; border-radius:8px;
    font:500 13px / 1 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    z-index:2147483647; pointer-events:none;
    backdrop-filter:blur(8px);
    box-shadow:0 4px 20px rgba(0,0,0,.35);
    opacity:1; transition:opacity .3s ease;
  `;
    document.body.appendChild(t);
    setTimeout(() => {
        t.style.opacity = '0';
        setTimeout(() => t.remove(), 320);
    }, ms);
}

// ─── Video scanner ────────────────────────────────────────────────────────────

function scanVideos(): void {
    document.querySelectorAll<HTMLVideoElement>('video').forEach(attachButton);
}

// Watch for SPAs / lazy-loaded players (YouTube, Netflix, etc.)
new MutationObserver(scanVideos).observe(document.documentElement, {
    childList: true,
    subtree: true,
});

// Scan once DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanVideos);
} else {
    scanVideos();
}

// ─── Message listener ─────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener(
    (msg: ExtMessage, _sender, sendResponse: (r: ExtResponse) => void) => {

        if (msg.action === 'toggle-pip') {
            const video = getBestVideo();
            if (video) {
                window.PipExt.toggle(video);
                sendResponse({ success: true, active: !!document.pictureInPictureElement });
            } else {
                sendResponse({ success: false, error: 'No video found' });
            }
            return true;
        }

        if (msg.action === 'exit-pip') {
            const p = document.pictureInPictureElement
                ? document.exitPictureInPicture()
                : Promise.resolve();
            p.then(() => sendResponse({ success: true, active: false }));
            return true;
        }

        if (msg.action === 'get-status') {
            sendResponse({
                success: true,
                active: !!document.pictureInPictureElement,
            });
            return false;
        }
    }
);