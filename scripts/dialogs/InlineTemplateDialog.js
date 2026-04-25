/**
 * pf2e-inline-automation-helper | InlineTemplateDialog.js
 *
 * Dialog for constructing @Template[...]{label} strings.
 *
 * Syntax:
 *   @Template[type:emanation|distance:30]
 *   @Template[type:line|distance:60|width:10]{60- by 10-Foot Line}
 *   @Template[type:burst|distance:20]{20-Foot Burst}
 *
 * The label is auto-generated as "X-foot Type" if omitted.
 * Width is only applicable for Line templates (creates non-5-ft wide lines or squares).
 */

import { insertIntoEditor } from "../utils.js";

const MODULE_ID = "pf2e-inline-automation-helper";
const TEMPLATE = `modules/${MODULE_ID}/templates/inline-template.hbs`;

export class InlineTemplateDialog extends Application {
  constructor(view, options = {}) {
    super(options);
    this._editorView = view;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: `${MODULE_ID}-template-dialog`,
      title: game.i18n.localize("PF2EIAH.TemplateDialog.Title"),
      template: TEMPLATE,
      width: 440,
      height: "auto",
      resizable: false,
      classes: [MODULE_ID, "inline-template-dialog"],
    });
  }

  getData() {
    return {
      types: [
        { value: "emanation", label: "Emanation" },
        { value: "burst", label: "Burst" },
        { value: "cone", label: "Cone" },
        { value: "line", label: "Line" },
      ],
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Show width field only for Line
    const toggleWidth = () => {
      const isLine = html.find("#pia-type").val() === "line";
      html.find(".width-field").toggle(isLine);
    };
    html.find("#pia-type").on("change", toggleWidth);
    toggleWidth();

    html.find("input, select").on("change input", () => {
      const data = this._readForm(html);
      html.find(".pia-preview code").text(this._buildSyntax(data));
    });

    html.find("[data-action='insert']").on("click", () => this._onInsert(html));
    html.find("[data-action='cancel']").on("click", () => this.close());
  }

  _readForm(html) {
    return {
      type: html.find("#pia-type").val(),
      distance: html.find("#pia-distance").val()?.trim(),
      width: html.find("#pia-width").val()?.trim(),
      traits: html.find("#pia-traits").val()?.trim(),
      label: html.find("#pia-label").val()?.trim(),
    };
  }

  _buildSyntax(d) {
    if (!d.type || !d.distance) return "@Template[type:emanation|distance:?]";

    const parts = [`type:${d.type}`, `distance:${d.distance}`];
    if (d.type === "line" && d.width) parts.push(`width:${d.width}`);
    if (d.traits) parts.push(`traits:${d.traits}`);

    let result = `@Template[${parts.join("|")}]`;

    // Build auto-label or use custom
    const customLabel = d.label || this._autoLabel(d);
    if (customLabel) result += `{${customLabel}}`;

    return result;
  }

  _autoLabel(d) {
    if (!d.distance) return "";
    const typeName = d.type.charAt(0).toUpperCase() + d.type.slice(1);
    if (d.type === "line" && d.width) {
      // e.g. "60- by 10-Foot Line"
      return `${d.distance}- by ${d.width}-Foot ${typeName}`;
    }
    // e.g. "30-Foot Emanation"
    return `${d.distance}-Foot ${typeName}`;
  }

  _onInsert(html) {
    insertIntoEditor(this._editorView, this._buildSyntax(this._readForm(html)));
    this.close();
  }
}
