// FloatVid – Options Page Script

import type { UserSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const showOverlayButton = document.getElementById('showOverlayButton') as HTMLInputElement;
const overlayPosition = document.getElementById('overlayPosition') as HTMLSelectElement;
const shortcutHint = document.getElementById('shortcutHint') as HTMLInputElement;
const autoEnterOnPlay = document.getElementById('autoEnterOnPlay') as HTMLInputElement;
const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;
const savedMsg = document.getElementById('savedMsg') as HTMLElement;

// ─── Load saved settings ──────────────────────────────────────────────────────

async function loadSettings(): Promise<void> {
    const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS) as UserSettings;

    showOverlayButton.checked = stored.showOverlayButton;
    overlayPosition.value = stored.overlayPosition;
    shortcutHint.checked = stored.shortcutHint;
    autoEnterOnPlay.checked = stored.autoEnterOnPlay;
}

// ─── Save settings ────────────────────────────────────────────────────────────

saveBtn.addEventListener('click', async () => {
    const settings: UserSettings = {
        showOverlayButton: showOverlayButton.checked,
        overlayPosition: overlayPosition.value as UserSettings['overlayPosition'],
        shortcutHint: shortcutHint.checked,
        autoEnterOnPlay: autoEnterOnPlay.checked,
    };

    await chrome.storage.sync.set(settings);

    savedMsg.textContent = '✓ Settings saved!';
    savedMsg.style.opacity = '1';
    setTimeout(() => {
        savedMsg.style.opacity = '0';
    }, 2000);
});

// ─── Boot ─────────────────────────────────────────────────────────────────────

loadSettings();