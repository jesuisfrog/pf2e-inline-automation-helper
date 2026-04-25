/**
 * pf2e-inline-automation-helper | InlineRollDialog.js
 *
 * Dialog for constructing simple [[/r]] or [[/gmr]] inline roll strings.
 *
 * Syntax:
 *   [[/r 1d4 #Recharge Breath Weapon]]{1d4 rounds}
 *   [[/gmr 1d4 #Recharge Breath Weapon]]{1d4 rounds}
 */

import { insertIntoEditor } from "../utils.js";

const MODULE_ID = "pf2e-inline-automation-helper";
const TEMPLATE = `modules/${MODULE_ID}/templates/inline-roll.hbs`;

export class InlineRollDialog extends Application {
  constructor(view, options = {}) {
    super(options);
    this._editorView = view;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: `${MODULE_ID}-roll-dialog`,
      title: game.i18n.localize("PF2EIAH.RollDialog.Title"),
      template: TEMPLATE,
      width: 440,
      height: "auto",
      resizable: false,
      classes: [MODULE_ID, "inline-roll-dialog"],
    });
  }

  getData() { return {}; }

  activateListeners(html) {
    super.activateListeners(html);

    html.find("input, select").on("change input", () => {
      const data = this._readForm(html);
      html.find(".pia-preview code").text(this._buildSyntax(data));
    });

    html.find("[data-action='insert']").on("click", () => this._onInsert(html));
    html.find("[data-action='cancel']").on("click", () => this.close());
  }

  _readForm(html) {
    return {
      formula: html.find("#pia-formula").val()?.trim(),
      flavor: html.find("#pia-flavor").val()?.trim(),
      gmRoll: html.find("#pia-gm-roll").is(":checked"),
      label: html.find("#pia-label").val()?.trim(),
    };
  }

  _buildSyntax(d) {
    if (!d.formula) return "[[/r ]]";
    const cmd = d.gmRoll ? "/gmr" : "/r";
    const flavor = d.flavor ? ` #${d.flavor}` : "";
    let result = `[[${cmd} ${d.formula}${flavor}]]`;
    if (d.label) result += `{${d.label}}`;
    return result;
  }

  _onInsert(html) {
    insertIntoEditor(this._editorView, this._buildSyntax(this._readForm(html)));
    this.close();
  }
}
