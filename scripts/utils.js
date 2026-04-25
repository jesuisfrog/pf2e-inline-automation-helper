/**
 * pf2e-inline-automation-helper | utils.js
 * Shared utility functions and data constants.
 */

// ---------------------------------------------------------------------------
// ProseMirror text insertion
// ---------------------------------------------------------------------------

/**
 * Insert a plain-text string at the current cursor position (or replace the current selection) inside a ProseMirror EditorView.
 *
 * PF2e enricher syntax (@Check, @Damage, @Template) is stored as raw text in the document and converted to interactive elements only when rendered.
 * Inserting it as plain text is therefore correct.
 *
 * @param {EditorView} view  The ProseMirror EditorView instance.
 * @param {string}     text  The string to insert.
 */
export function insertIntoEditor(view, text) {
  if (!view) {
    ui.notifications.warn("PF2e Inline Automation: could not locate the editor view.");
    return;
  }
  const { state, dispatch } = view;
  const { from, to } = state.selection;
  const tr = state.tr.insertText(text, from, to);
  dispatch(tr);
  view.focus();
}

// ---------------------------------------------------------------------------
// Data constants used by multiple dialogs
// ---------------------------------------------------------------------------

/** All save types (subset of check types). */
export const SAVE_TYPES = ["fortitude", "reflex", "will"];

/** Full list of check-type options presented in the Check dialog. */
export const CHECK_TYPES = [
  // Saves
  { value: "fortitude",     label: "Fortitude Save",      group: "Saves" },
  { value: "reflex",        label: "Reflex Save",          group: "Saves" },
  { value: "will",          label: "Will Save",            group: "Saves" },
  // Perception
  { value: "perception",    label: "Perception",           group: "Perception" },
  // Skills
  { value: "acrobatics",    label: "Acrobatics",           group: "Skills" },
  { value: "arcana",        label: "Arcana",               group: "Skills" },
  { value: "athletics",     label: "Athletics",            group: "Skills" },
  { value: "crafting",      label: "Crafting",             group: "Skills" },
  { value: "deception",     label: "Deception",            group: "Skills" },
  { value: "diplomacy",     label: "Diplomacy",            group: "Skills" },
  { value: "intimidation",  label: "Intimidation",         group: "Skills" },
  { value: "medicine",      label: "Medicine",             group: "Skills" },
  { value: "nature",        label: "Nature",               group: "Skills" },
  { value: "occultism",     label: "Occultism",            group: "Skills" },
  { value: "performance",   label: "Performance",          group: "Skills" },
  { value: "religion",      label: "Religion",             group: "Skills" },
  { value: "society",       label: "Society",              group: "Skills" },
  { value: "stealth",       label: "Stealth",              group: "Skills" },
  { value: "survival",      label: "Survival",             group: "Skills" },
  { value: "thievery",      label: "Thievery",             group: "Skills" },
  // Flat / special
  { value: "flat",          label: "Flat Check",           group: "Special" },
  { value: "custom",        label: "Custom / Lore …",      group: "Custom" },
];

/** Damage types for the Damage dialog. */
export const DAMAGE_TYPES = [
  // Physical
  { value: "bludgeoning", label: "Bludgeoning", group: "Physical" },
  { value: "piercing",    label: "Piercing",     group: "Physical" },
  { value: "slashing",    label: "Slashing",     group: "Physical" },
  // Energy
  { value: "acid",        label: "Acid",         group: "Energy" },
  { value: "cold",        label: "Cold",         group: "Energy" },
  { value: "electricity", label: "Electricity",  group: "Energy" },
  { value: "fire",        label: "Fire",         group: "Energy" },
  { value: "sonic",       label: "Sonic",        group: "Energy" },
  // Alignment / spirit
  { value: "chaotic",     label: "Chaotic",      group: "Alignment" },
  { value: "evil",        label: "Evil",         group: "Alignment" },
  { value: "good",        label: "Good",         group: "Alignment" },
  { value: "lawful",      label: "Lawful",       group: "Alignment" },
  // Vital
  { value: "vitality",    label: "Vitality",     group: "Vital" },
  { value: "void",        label: "Void",         group: "Vital" },
  // Other
  { value: "bleed",       label: "Bleed",        group: "Other" },
  { value: "force",       label: "Force",        group: "Other" },
  { value: "mental",      label: "Mental",       group: "Other" },
  { value: "negative",    label: "Negative (legacy)", group: "Other" },
  { value: "poison",      label: "Poison",       group: "Other" },
  { value: "positive",    label: "Positive (legacy)", group: "Other" },
  { value: "spirit",      label: "Spirit",       group: "Other" },
  { value: "",            label: "(none / untyped)", group: "Other" },
];


/** Common defense statistics for the Check dialog. */
export const DEFENSE_STATS = [
  { value: "ac",          label: "Armor Class (AC)" },
  { value: "fortitude",   label: "Fortitude DC" },
  { value: "reflex",      label: "Reflex DC" },
  { value: "will",        label: "Will DC" },
  { value: "perception",  label: "Perception DC" },
  { value: "deception",   label: "Deception DC" },
  { value: "stealth",     label: "Stealth DC" },
  { value: "thievery",    label: "Thievery DC" },
  { value: "athletics",   label: "Athletics DC" },
];

/** "Against" statistics available in the Check dialog. */
export const AGAINST_STATS = [
  { value: "class-dc",           label: "Class DC" },
  { value: "spell-dc",           label: "Spell DC" },
  { value: "class-or-spell-dc",  label: "Higher of Class/Spell DC" },
  ...DEFENSE_STATS,
];
