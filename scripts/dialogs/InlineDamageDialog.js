/**
 * pf2e-inline-automation-helper | InlineDamageDialog.js
 *
 * Dialog for constructing @Damage[...]{label} or [[/r ...]]{label} strings.
 *
 * @Damage syntax reference:
 *   Simple:       @Damage[1d6[fire]]{label}
 *   With parens:  @Damage[(1d6+3)[fire]]
 *   Precision:    @Damage[(2d6+4+(2d6[precision]))[slashing]]
 *   Splash:       @Damage[(5[splash])[fire]]
 *   Persistent:   @Damage[1d6[persistent,fire]]
 *   Multi-pool:   @Damage[5d6[acid],5d6[cold]]
 *   With options: @Damage[2d6[fire]|options:area-damage]
 *
 * [[/r]] fallback:
 *   [[/r 1d6[fire]]]{label}
 */

import { insertIntoEditor, DAMAGE_TYPES } from "../utils.js";

const MODULE_ID = "pf2e-inline-automation-helper";
const TEMPLATE = `modules/${MODULE_ID}/templates/inline-damage.hbs`;

export class InlineDamageDialog extends Application {
  constructor(view, options = {}) {
    super(options);
    this._editorView = view;
    // We manage extra damage pools client-side via _pools array
    this._pools = [{ formula: "", type: "", category: "none" }];
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: `${MODULE_ID}-damage-dialog`,
      title: game.i18n.localize("PF2EIAH.DamageDialog.Title"),
      template: TEMPLATE,
      width: 540,
      height: "auto",
      resizable: true,
      classes: [MODULE_ID, "inline-damage-dialog"],
    });
  }

  getData() {
    return {
      pools: this._pools,
      damageTypes: DAMAGE_TYPES,
      categories: [
        { value: "none", label: "None" },
        { value: "precision", label: "Precision" },
        { value: "splash", label: "Splash" },
        { value: "persistent", label: "Persistent" },
      ],
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Add pool
    html.find("[data-action='add-pool']").on("click", () => {
      this._syncPoolsFromDom(html);
      this._pools.push({ formula: "", type: "", category: "none" });
      this.render(false); // re-render to add new pool row
    });

    // Remove pool (event delegation)
    html.on("click", "[data-action='remove-pool']", (e) => {
      const idx = parseInt($(e.currentTarget).data("pool-index"), 10);
      this._syncPoolsFromDom(html);
      this._pools.splice(idx, 1);
      if (this._pools.length === 0) this._pools.push({ formula: "", type: "", category: "none" });
      this.render(false);
    });

    // Live preview
    html.find("input, select").on("change input", () => {
      const data = this._readForm(html);
      html.find(".pia-preview code").text(this._buildSyntax(data));
    });

    html.find("[data-action='insert']").on("click", () => this._onInsert(html));
    html.find("[data-action='cancel']").on("click", () => this.close());
  }

  // ---------------------------------------------------------------------------

  /** Read the current pool rows from the DOM and save back to this._pools. */
  _syncPoolsFromDom(html) {
    this._pools = [];
    html.find(".pia-pool-row").each((i, row) => {
      this._pools.push({
        formula: $(row).find(".pia-formula").val()?.trim(),
        type: $(row).find(".pia-type").val()?.trim(),
        category: $(row).find(".pia-category").val(),
      });
    });
  }

  _readForm(html) {
    this._syncPoolsFromDom(html);
    return {
      useAtDamage: html.find("#pia-use-at-damage").is(":checked"),
      pools: this._pools,
      options: html.find("#pia-options").val()?.trim(),
      label: html.find("#pia-label").val()?.trim(),
    };
  }

  /**
   * Build the damage formula string for one pool.
   *   formula="1d6", type="fire", category="none"   → 1d6[fire]
   *   formula="1d6", type="fire", category="persistent" → 1d6[persistent,fire]
   *   formula="2d6+4", type="fire", category="precision" → (2d6+4+(formula[precision]))[fire]
   *     Actually precision is nested: (outer+(inner[precision]))[outerType]
   *     For simplicity we wrap the whole thing: (formula[precision])[type]
   *   formula="5",   type="fire", category="splash"  → (5[splash])[fire]
   */
  _poolToFormula(pool) {
    const { formula, type, category } = pool;
    if (!formula) return "";

    const typeStr = type ? `[${type}]` : "";

    if (category === "none" || !category) {
      // Simple: formula[type]
      return `${formula}${typeStr}`;
    }

    if (category === "persistent") {
      // persistent is included alongside the type, no inner parens
      const typeWithPersistent = type ? `[persistent,${type}]` : "[persistent]";
      return `${formula}${typeWithPersistent}`;
    }

    // precision / splash — need inner parens for the special category
    // and then outer parens + type for the whole expression
    // e.g. (2d6[precision])[slashing]  or  (5[splash])[fire]
    const inner = `${formula}[${category}]`;
    return `(${inner})${typeStr}`;
  }

  _buildSyntax(d) {
    const validPools = d.pools.filter(p => p.formula?.trim());
    if (validPools.length === 0) return d.useAtDamage ? "@Damage[]" : "[[/r ]]";

    const poolStr = validPools.map(p => this._poolToFormula(p)).join(",");

    if (d.useAtDamage) {
      let inner = poolStr;
      if (d.options) inner += `|options:${d.options}`;
      let result = `@Damage[${inner}]`;
      if (d.label) result += `{${d.label}}`;
      return result;
    } else {
      // [[/r formula]]{label}
      let result = `[[/r ${poolStr}]]`;
      if (d.label) result += `{${d.label}}`;
      return result;
    }
  }

  _onInsert(html) {
    const data = this._readForm(html);
    const syntax = this._buildSyntax(data);
    insertIntoEditor(this._editorView, syntax);
    this.close();
  }
}
