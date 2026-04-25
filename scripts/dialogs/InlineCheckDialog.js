/**
 * pf2e-inline-automation-helper | InlineCheckDialog.js
 *
 * Dialog for constructing @Check[...] inline automation strings.
 *
 * Syntax reference (parameters in style-guide order):
 *   @Check[type|defense:stat|against:stat|dc:value|basic|showDC:who|
 *          adjustment:n|immutable|name:text|traits:x,y|options:x,y|
 *          rollerRole:origin|overrideTraits]{label}
 */

import { insertIntoEditor, CHECK_TYPES, SAVE_TYPES, DEFENSE_STATS, AGAINST_STATS } from "../utils.js";

const MODULE_ID = "pf2e-inline-automation-helper";
const TEMPLATE = `modules/${MODULE_ID}/templates/inline-check.hbs`;

export class InlineCheckDialog extends Application {
  /**
   * @param {import("prosemirror-view").EditorView} view
   * @param {object} [options]
   */
  constructor(view, options = {}) {
    super(options);
    this._editorView = view;
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: `${MODULE_ID}-check-dialog`,
      title: game.i18n.localize("PF2EIAH.CheckDialog.Title"),
      template: TEMPLATE,
      width: 520,
      height: "auto",
      resizable: true,
      classes: [MODULE_ID, "inline-check-dialog"],
    });
  }

  /** @override */
  getData() {
    return {
      checkTypes: CHECK_TYPES,
      defenseStats: DEFENSE_STATS,
      againstStats: AGAINST_STATS,
      showDCOptions: [
        { value: "owner", label: "Owner only (default)" },
        { value: "gm", label: "GM only" },
        { value: "all", label: "All players" },
        { value: "none", label: "No one" },
      ],
      rollerRoleOptions: [
        { value: "", label: "(default)" },
        { value: "origin", label: "origin" },
        { value: "target", label: "target" },
      ],
    };
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    const dcMethod = html.find("#pia-dc-method");
    const saveType = html.find("#pia-type-select");

    // Show/hide DC sub-fields based on selected method
    const toggleDcFields = () => {
      const method = dcMethod.val();
      html.find(".dc-field").hide();
      html.find(`.dc-field[data-method="${method}"]`).show();
    };
    dcMethod.on("change", toggleDcFields);
    toggleDcFields();

    // Show/hide "basic" and "roller role" contextually
    const toggleSaveFields = () => {
      const types = (html.find("#pia-type-select").val() || "").split(",").map(t => t.trim());
      const isSave = types.some(t => SAVE_TYPES.includes(t));
      const method = dcMethod.val();
      html.find(".save-only-field").toggle(isSave);
      html.find(".against-only-field").toggle(method === "against");
    };
    saveType.on("input", toggleSaveFields);
    dcMethod.on("change", toggleSaveFields);
    toggleSaveFields();

    // Custom type text field visibility
    html.find("#pia-type-select-preset").on("change", (e) => {
      const val = $(e.currentTarget).val();
      html.find("#pia-custom-type-row").toggle(val === "custom");
      if (val !== "custom") html.find("#pia-type-select").val(val);
    });

    // Update hidden combined type field when custom is typed
    html.find("#pia-custom-type-input").on("input", (e) => {
      html.find("#pia-type-select").val($(e.currentTarget).val());
    });

    // Live preview
    html.find("input, select, textarea").on("change input", () => {
      const syntax = this._buildSyntax(this._readForm(html));
      html.find(".pia-preview code").text(syntax);
    });

    // Buttons
    html.find("[data-action='insert']").on("click", () => this._onInsert(html));
    html.find("[data-action='cancel']").on("click", () => this.close());
  }

  // ---------------------------------------------------------------------------

  _readForm(html) {
    return {
      type: html.find("#pia-type-select").val()?.trim(),
      dcMethod: html.find("#pia-dc-method").val(),
      dcValue: html.find("#pia-dc-value").val()?.trim(),
      defenseStat: html.find("#pia-defense-stat").val()?.trim(),
      againstStat: html.find("#pia-against-stat").val()?.trim(),
      rollerRole: html.find("#pia-roller-role").val()?.trim(),
      basic: html.find("#pia-basic").is(":checked"),
      showDC: html.find("#pia-show-dc").val(),
      adjustment: html.find("#pia-adjustment").val()?.trim(),
      immutable: html.find("#pia-immutable").is(":checked"),
      name: html.find("#pia-name").val()?.trim(),
      traits: html.find("#pia-traits").val()?.trim(),
      options: html.find("#pia-options").val()?.trim(),
      overrideTraits: html.find("#pia-override-traits").is(":checked"),
      label: html.find("#pia-label").val()?.trim(),
    };
  }

  /**
   * Build the @Check[...]{label} string from form data, following the
   * style-guide parameter order exactly.
   */
  _buildSyntax(d) {
    if (!d.type) return "@Check[]";

    const parts = [d.type]; // type is always first

    // DC method (mutually exclusive)
    if (d.dcMethod === "defense" && d.defenseStat) {
      parts.push(`defense:${d.defenseStat}`);
    } else if (d.dcMethod === "against" && d.againstStat) {
      parts.push(`against:${d.againstStat}`);
      if (d.rollerRole) parts.push(`rollerRole:${d.rollerRole}`);
    } else if (d.dcMethod === "dc" && d.dcValue) {
      parts.push(`dc:${d.dcValue}`);
    }

    if (d.basic) parts.push("basic");
    if (d.showDC && d.showDC !== "owner") parts.push(`showDC:${d.showDC}`);
    if (d.adjustment) parts.push(`adjustment:${d.adjustment}`);
    if (d.immutable) parts.push("immutable");
    if (d.name) parts.push(`name:${d.name}`);
    if (d.traits) parts.push(`traits:${d.traits}`);
    if (d.options) parts.push(`options:${d.options}`);
    if (d.overrideTraits) parts.push("overrideTraits");

    let result = `@Check[${parts.join("|")}]`;
    if (d.label) result += `{${d.label}}`;
    return result;
  }

  _onInsert(html) {
    const data = this._readForm(html);
    const syntax = this._buildSyntax(data);
    insertIntoEditor(this._editorView, syntax);
    this.close();
  }
}
