// PiP Extension — YouTube content script
(() => {
  "use strict";

  function getVideo() {
    return (
      document.querySelector("video.html5-main-video") ||
      document.querySelector("video")
    );
  }

  function injectButton() {
    if (document.getElementById(PipExt.BUTTON_ID)) return;

    // YouTube 2024+ nests controls; fall back to flat layout
    const container =
      document.querySelector(".ytp-right-controls-right") ||
      document.querySelector(".ytp-right-controls");
    if (!container) return;

    const btn = PipExt.createButton("ytp-button");

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      PipExt.toggle(getVideo());
    });

    // Insert before fullscreen button if it's a direct child
    const fsBtn = container.querySelector(".ytp-fullscreen-button");
    if (fsBtn && fsBtn.parentNode === container) {
      container.insertBefore(btn, fsBtn);
    } else {
      container.prepend(btn);
    }

    const video = getVideo();
    if (video) {
      PipExt.attachListeners(video);
      PipExt.active = !!document.pictureInPictureElement;
      PipExt.updateButton();
    }
  }

  // ─── Observer: YouTube SPA re-renders controls on navigation ──
  function setupObserver() {
    document.addEventListener("yt-navigate-finish", () => {
      setTimeout(injectButton, 500);
    });

    const observer = new MutationObserver(() => {
      if (!document.getElementById(PipExt.BUTTON_ID)) injectButton();
      const video = getVideo();
      if (video) PipExt.attachListeners(video);
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ─── Init ──────────────────────────────────────────────────────
  function init() {
    PipExt.setupAutoPip(getVideo);
    PipExt.setupMessageListener(getVideo);
    injectButton();
    setupObserver();

    // Retry in case the player loads slowly
    for (const delay of [1000, 2000, 4000]) {
      setTimeout(() => {
        if (!document.getElementById(PipExt.BUTTON_ID)) injectButton();
      }, delay);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
