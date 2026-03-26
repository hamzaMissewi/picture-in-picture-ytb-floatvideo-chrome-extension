// PiP Extension — Shared utilities (loaded before site-specific scripts)
"use strict";

const PipExt = (() => {
  const BUTTON_ID = "pip-ext-button";
  const STORAGE_KEY = "pip_window_size";
  const SVG_NS = "http://www.w3.org/2000/svg";

  let pipActive = false;
  let autoPipEnabled = true;
  let userOptedOut = false;

  // ─── i18n ──────────────────────────────────────────────────────
  const i18n = (key) => chrome.i18n.getMessage(key) || key;

  // ─── SVG icons (Trusted Types safe — no innerHTML) ─────────────
  function _makeSvg(d) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("height", "100%");
    svg.setAttribute("width", "100%");
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    svg.appendChild(path);
    return svg;
  }

  const enterIcon = () =>
    _makeSvg("M19 11h-8v6h8v-6zm4 10V3H1v18h22zm-2-1.98H3V4.97h18v14.05z");
  const exitIcon = () =>
    _makeSvg("M21 3H3v18h18V3zm-2 16H5V5h14v14zm-4-8H9v6h6v-6z");

  // ─── PiP toggle ────────────────────────────────────────────────
  async function toggle(video) {
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        userOptedOut = true;
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        userOptedOut = false;
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.warn("[PiP Extension]", err.message);
    }
  }

  // ─── Save PiP window size ─────────────────────────────────────
  function savePipSize(pipWindow) {
    if (!pipWindow) return;
    try {
      chrome.storage.local.set({
        [STORAGE_KEY]: { width: pipWindow.width, height: pipWindow.height },
      });
    } catch (_) {}
  }

  // ─── Update button appearance ──────────────────────────────────
  function updateButton() {
    const btn = document.getElementById(BUTTON_ID);
    if (!btn) return;
    const tooltip = btn.querySelector(".pip-ext-tooltip");
    const icon = btn.querySelector(".pip-ext-icon");
    if (pipActive) {
      btn.classList.add("pip-ext-active");
      if (tooltip) tooltip.textContent = i18n("tooltipExit");
      if (icon) icon.replaceChildren(exitIcon());
    } else {
      btn.classList.remove("pip-ext-active");
      if (tooltip) tooltip.textContent = i18n("tooltipEnter");
      if (icon) icon.replaceChildren(enterIcon());
    }
  }

  // ─── Attach PiP event listeners to a video element ─────────────
  function attachListeners(video) {
    if (!video || video.__pipExt) return;
    video.__pipExt = true;

    video.addEventListener("enterpictureinpicture", (e) => {
      pipActive = true;
      updateButton();
      const w = e.pictureInPictureWindow;
      if (w) {
        w.addEventListener("resize", () => savePipSize(w));
        savePipSize(w);
      }
    });

    video.addEventListener("leavepictureinpicture", () => {
      pipActive = false;
      updateButton();
    });
  }

  // ─── Build the button (site script wraps / positions it) ──────
  function createButton(extraClasses) {
    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.className = "pip-ext-button " + extraClasses;
    btn.setAttribute("aria-label", i18n("ariaLabel"));

    const tooltip = document.createElement("span");
    tooltip.className = "pip-ext-tooltip";
    tooltip.textContent = i18n("tooltipEnter");
    btn.appendChild(tooltip);

    const icon = document.createElement("span");
    icon.className = "pip-ext-icon";
    icon.appendChild(enterIcon());
    btn.appendChild(icon);

    return btn;
  }

  // ─── Auto-PiP on tab switch ────────────────────────────────────
  function setupAutoPip(getVideo) {
    document.addEventListener("visibilitychange", () => {
      if (!autoPipEnabled || userOptedOut) return;
      const video = getVideo();
      if (!video || video.paused || document.pictureInPictureElement) return;
      if (document.visibilityState === "hidden") {
        video.requestPictureInPicture().catch(() => {});
      }
    });
  }

  // ─── Message listener (from background.js keyboard shortcut) ──
  function setupMessageListener(getVideo, beforeToggle) {
    chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
      if (req.action === "toggle-pip") {
        const video = getVideo();
        if (beforeToggle) beforeToggle(video);
        toggle(video);
        sendResponse({ ok: true });
      } else if (req.action === "set-auto-pip") {
        autoPipEnabled = req.enabled;
        sendResponse({ ok: true });
      }
      return true;
    });
  }

  // ─── Public API ────────────────────────────────────────────────
  return {
    BUTTON_ID,
    i18n,
    toggle,
    updateButton,
    attachListeners,
    createButton,
    setupAutoPip,
    setupMessageListener,
    get active() {
      return pipActive;
    },
    set active(v) {
      pipActive = v;
    },
  };
})();
