/**
 * pf2e-inline-automation-helper | toolbar.js
 *
 * Registers a "PF2e Automation Helper" dropdown in every ProseMirror editor.
 *
  * The dropdown entries open dialog windows defined in dialogs/*.js, which generate the appropriate inline automation syntax and insert it into the editor.
 */

import { InlineCheckDialog } from "./dialogs/InlineCheckDialog.js";
import { InlineDamageDialog } from "./dialogs/InlineDamageDialog.js";
import { InlineRollDialog } from "./dialogs/InlineRollDialog.js";
import { InlineTemplateDialog } from "./dialogs/InlineTemplateDialog.js";

/**
 * @param {ProseMirrorMenu} menu
 * @param {object}          dropdowns
 */
export function registerToolbarDropdowns(menu, dropdowns) {
  const view = menu.view;

  dropdowns["pf2e-inline-automation-helper"] = {
    title: game.i18n.localize("PF2EIAH.DropdownTitle"),
    cssClass: "pf2e-inline-automation-helper-dropdown",
    // Single space: triggers Foundry to add its "icon" layout class to the button without producing visible text. The actual icon comes from CSS.
    icon: " ",
    entries: [
      {
        action: "pf2e-inline-check",
        title: "@Check — Skill / Save / Flat",
        cmd: () => new InlineCheckDialog(view).render(true),
      },
      {
        action: "pf2e-inline-damage",
        title: "@Damage — Damage Roll",
        cmd: () => new InlineDamageDialog(view).render(true),
      },
      {
        action: "pf2e-inline-roll",
        title: "[[/r]] — Plain Roll",
        cmd: () => new InlineRollDialog(view).render(true),
      },
      {
        action: "pf2e-inline-template",
        title: "@Template — Area Template",
        cmd: () => new InlineTemplateDialog(view).render(true),
      },
    ],
  };
}
