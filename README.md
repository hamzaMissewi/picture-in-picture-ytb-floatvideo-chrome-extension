# FloatVid – Picture-in-Picture Chrome Extension

> Float any video in a resizable, always-on-top window.  
> Works on YouTube, Netflix, Twitch, Prime Video, Disney+ and every site with a `<video>` element.

---

## Stack

| Tool | Role |
|------|------|
| TypeScript 5 | All source files |
| Vite 5 | Multi-entry bundler |
| Sharp | Icon generation |
| Chrome MV3 | Extension platform |

---

## Project structure

```
floatvid-extension/
├── public/
│   └── icons/            ← Generated PNGs (run `npm run icons`)
├── src/
│   ├── types.ts           ← Shared types + default settings
│   ├── background.ts      ← Service worker
│   ├── content.ts         ← Injected into every page
│   ├── popup/
│   │   ├── popup.html
│   │   └── popup.ts
│   └── options/
│       ├── options.html
│       └── options.ts
├── scripts/
│   ├── generate-icons.ts  ← Sharp icon generator
│   └── package.mjs        ← Zip packager for CWS
├── manifest.json
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting started

```bash
# 1. Install deps
npm install

# 2. Generate icons
npm run icons

# 3. Build extension
npm run build

# 4. Load in Chrome
#    chrome://extensions → Enable "Developer mode" → "Load unpacked" → select /dist
```

---

## Development (watch mode)

```bash
npm run dev
# Rebuilds on every file save — just reload the extension in chrome://extensions
```

---

## Keyboard shortcuts

| Platform | Shortcut |
|----------|----------|
| Windows / Linux / ChromeOS | `Ctrl+Shift+P` |
| macOS | `Cmd+Shift+P` |
| All platforms (alt) | `Alt+P` |

Shortcuts can be reassigned at `chrome://extensions/shortcuts`.

---

## Publish to Chrome Web Store

```bash
npm run package
# → floatvid-extension.zip
```

Then upload to [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole/).

**CWS checklist:**
- [ ] Icons: 16, 32, 48, 128px PNGs
- [ ] Screenshots: at least 1 × 1280×800 or 640×400
- [ ] Privacy policy URL (required if you have any `host_permissions`)
- [ ] Short description ≤ 132 chars
- [ ] Category: *Productivity* or *Workflow & Planning*

---

## Settings

Open the Settings page via the ⚙ icon in the popup or `chrome://extensions` → *Details* → *Extension options*.

| Setting | Default | Description |
|---------|---------|-------------|
| Show hover button | ✅ | Overlay PiP button when hovering a video |
| Button position | Top-right | Where the overlay button appears |
| Shortcut hint | ✅ | Show keyboard hint in popup |
| Auto-float on tab switch | ❌ | Enter PiP automatically when switching tabs |

---

## Built by

[Hamza Missaoui](https://www.hamzamissaoui.dev) — [GitHub](https://github.com/hamzaMissewi)