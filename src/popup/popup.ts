// FloatVid – Popup Script

import type { ExtMessage, ExtResponse, UserSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const btn = document.getElementById('togglePip') as HTMLButtonElement;
const dot = document.getElementById('statusDot') as HTMLElement;
const label = document.getElementById('statusLabel') as HTMLElement;
const optionsBtn = document.getElementById('optionsBtn') as HTMLButtonElement;
const shortcutRow = document.getElementById('shortcutRow') as HTMLElement;

// ─── Status helpers ───────────────────────────────────────────────────────────

function setStatus(state: 'active' | 'inactive' | 'loading' | 'error' | 'restricted'): void {
    const cfg: Record<typeof state, { dot: string; html: string; btn: string; bg: string }> = {
        active: { dot: 'active', html: '<strong>Floating</strong> — video is in PiP mode', btn: 'Exit Picture-in-Picture', bg: '#2ecc71' },
        inactive: { dot: 'inactive', html: '<strong>Ready</strong> — click to float the video', btn: 'Toggle Picture-in-Picture', bg: 'var(--brand)' },
        loading: { dot: 'inactive', html: '<strong>Working…</strong>', btn: 'Toggle Picture-in-Picture', bg: 'var(--brand)' },
        error: { dot: 'inactive', html: '<strong>No video found</strong> on this page', btn: 'Toggle Picture-in-Picture', bg: '#e74c3c' },
        restricted: { dot: 'inactive', html: 'This page <strong>does not support</strong> PiP', btn: 'Toggle Picture-in-Picture', bg: '#f39c12' },
    };

    const c = cfg[state];
    dot.className = `dot ${c.dot}`;
    label.innerHTML = c.html;
    btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 3H3C1.9 3 1 3.9 1 5v14c0 1.1.9 2 2 2h18
               c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h8v6h-8z"/>
    </svg>
    ${c.btn}`;
    btn.style.background = c.bg;

    // Reset non-permanent states after delay
    if (state === 'error' || state === 'restricted') {
        setTimeout(() => setStatus('inactive'), 2500);
    }
}

// ─── Inject + query ───────────────────────────────────────────────────────────

async function getActiveTab(): Promise<chrome.tabs.Tab | null> {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab ?? null;
}

async function sendMsg(msg: ExtMessage): Promise<ExtResponse> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(msg, (r: ExtResponse) => {
            if (chrome.runtime.lastError) {
                const errorMsg = chrome.runtime.lastError.message;
                resolve({ success: false, ...(errorMsg && { error: errorMsg }) });
            } else {
                resolve(r);
            }
        });
    });
}

async function forceInject() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
    console.log("Content script force-injected");
}

// ─── Init: load PiP status + settings ────────────────────────────────────────

async function init(): Promise<void> {
    const tab = await getActiveTab();
    const url = tab?.url ?? '';

    if (!tab || /^(chrome|edge|about|data):/.test(url)) {
        setStatus('restricted');
        btn.disabled = true;
        return;
    }

    // Check live PiP status
    const res = await sendMsg({ action: 'get-status' });
    setStatus(res.active ? 'active' : 'inactive');

    // Load settings
    const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS) as UserSettings;
    if (!stored.shortcutHint) shortcutRow.style.display = 'none';
}

// ─── Button click ─────────────────────────────────────────────────────────────

btn.addEventListener('click', async () => {
    btn.disabled = true;
    setStatus('loading');

    const res = await sendMsg({ action: 'toggle-pip' });

    btn.disabled = false;

    if (!res.success) {
        setStatus(res.error?.includes('No video') ? 'error' : 'restricted');
    } else {
        setStatus(res.active ? 'active' : 'inactive');
    }
});

// ─── Options button ───────────────────────────────────────────────────────────

optionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});

// ─── Boot ─────────────────────────────────────────────────────────────────────

init();