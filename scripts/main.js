/**
 * pf2e-inline-automation-helper | main.js
 * Module entry point.
 */

import { registerToolbarDropdowns } from "./toolbar.js";
import { registerHandlebarsHelpers } from "./handlebars.js";
import { registerTemplates } from "./register-templates.js";

const MODULE_ID = "pf2e-inline-automation-helper";
const MODULE_TITLE = "PF2e Inline Automation Helper";

// ---------------------------------------------------------------------------
// Template pre-loading
// ---------------------------------------------------------------------------
Hooks.once("init", async () => {
  console.log(`${MODULE_TITLE} | Initializing`);

  registerTemplates();
  registerHandlebarsHelpers();
});

// ---------------------------------------------------------------------------
// System check
// ---------------------------------------------------------------------------
Hooks.once("ready", () => {
  console.log(`${MODULE_TITLE} | Ready`);

  if (game.system.id !== "pf2e") {
    ui.notifications.warn(
      `${MODULE_TITLE}: This module is designed for the PF2e system. ` +
      `The toolbar will still appear but the generated syntax may not work in other systems.`
    );
  }
  _startIconObserver();
});

// ---------------------------------------------------------------------------
// Toolbar hook
// ---------------------------------------------------------------------------
Hooks.on("getProseMirrorMenuDropDowns", registerToolbarDropdowns);

// ---------------------------------------------------------------------------
// Icon injection via MutationObserver
// ---------------------------------------------------------------------------

/**
 * Find every button.pf2e-inline-automation-helper-dropdown in the document that does not yet have our injected icon element and prepend a proper FA <i> to it.
 * The guard on .pia-icon prevents double-injection if the observer fires many times rapidly.
 */
function _injectIcons() {
  document
    .querySelectorAll("button.pf2e-inline-automation-helper-dropdown:not(:has(i.pia-icon))")
    .forEach(btn => {
      const icon = document.createElement("i");
      icon.className = "fa-solid fa-dice-d20 pia-icon";
      btn.prepend(icon);
    });
}

/**
 * Set up a MutationObserver on document.body that re-runs _injectIcons
 * whenever child nodes change anywhere in the DOM (covers dynamically opened editors and re-rendered menus).
 */
function _startIconObserver() {
  // Run once immediately for any editors already in the DOM at ready time.
  _injectIcons();

  const observer = new MutationObserver(_injectIcons);
  observer.observe(document.body, { childList: true, subtree: true });
}
