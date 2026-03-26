// ─── Shared types across background / content / popup ─────────────────────────

export type MessageAction =
    | 'toggle-pip'
    | 'exit-pip'
    | 'get-status'
    | 'open-options';

export interface ExtMessage {
    action: MessageAction;
}

export interface ExtResponse {
    success: boolean;
    active?: boolean;   // is PiP currently active?
    error?: string;
}

export interface UserSettings {
    showOverlayButton: boolean;   // show hover button on videos
    overlayPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    shortcutHint: boolean;   // show shortcut label in popup
    autoEnterOnPlay: boolean;   // (future) auto-PiP when tab hidden
}

export const DEFAULT_SETTINGS: UserSettings = {
    showOverlayButton: true,
    overlayPosition: 'top-right',
    shortcutHint: true,
    autoEnterOnPlay: false,
};