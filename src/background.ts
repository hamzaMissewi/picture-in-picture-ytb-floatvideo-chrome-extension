// FloatVid – Background Service Worker (MV3)

import type { ExtMessage, ExtResponse } from './types';

// ─── Helper: inject + message active tab ──────────────────────────────────────

async function sendToActiveTab(msg: ExtMessage): Promise<ExtResponse | null> {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return null;

    const url = tab.url ?? '';
    // Cannot inject into browser-internal pages
    if (/^(chrome|edge|about|data):/.test(url)) return null;

    // Ensure content script is alive (handles tabs open before extension install)
    try {
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js'],
        });
    } catch {
        // Already injected — that's fine
    }

    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tab.id!, msg, (response: ExtResponse) => {
            if (chrome.runtime.lastError) resolve(null);
            else resolve(response);
        });
    });
}

// ─── Keyboard shortcut ────────────────────────────────────────────────────────

chrome.commands.onCommand.addListener((command) => {
    if (command === 'toggle-pip') {
        sendToActiveTab({ action: 'toggle-pip' });
    }
});

// ─── Messages from popup ──────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener(
    (msg: ExtMessage, _sender, sendResponse: (r: ExtResponse) => void) => {
        if (msg.action === 'open-options') {
            chrome.runtime.openOptionsPage();
            sendResponse({ success: true });
            return false;
        }
        // Forward other actions to the active tab
        sendToActiveTab(msg).then((r) =>
            sendResponse(r ?? { success: false, error: 'No response from tab' })
        );
        return true; // async
    }
);

// ─── Install / update ─────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
        chrome.tabs.create({ url: 'https://www.hamzamissaoui.dev' });
    }
});