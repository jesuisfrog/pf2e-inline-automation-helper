# PF2e Inline Automation Helper

A [Foundry VTT](https://foundryvtt.com/) module for the **Pathfinder 2nd Edition** system.

Adds a dropdown to every ProseMirror text editor (item descriptions, journal pages, NPC abilities, etc.) so you can build correct PF2e inline automation syntax without memorising the style guide.

---

## Features

| Dialog | Syntax produced | Notes |
|---|---|---|
| **@Check** | `@Check[fortitude\|dc:20\|basic]` | All style-guide parameters in correct order; conditional fields for basic saves, roller-role, resolve(), etc. |
| **@Damage** | `@Damage[2d6[fire]\|options:area-damage]` | Dynamic multi-pool builder; precision/splash/persistent category handling |
| **Plain Roll** | `[[/r 1d4 #Recharge]]{1d4 rounds}` | GM-only (`/gmr`) toggle |
| **@Template** | `@Template[type:cone\|distance:30]` | Auto-generates label; width field for non-5-ft lines and squares |

Every dialog shows a **live preview** of the exact string that will be inserted before you commit.

---

## Requirements

| | |
|---|---|
| Foundry VTT | v13 (minimum `13`, verified `13.351`) |
| System | `pf2e` (module will warn if run on another system) |

---

## Installation

### Option A — manual (zip)

1. Unzip `pf2e-inline-automation-helper.zip` into your Foundry `Data/modules/` folder so the path reads `Data/modules/pf2e-inline-automation-helper/module.json`.
2. Restart Foundry (or reload modules).
3. Enable **PF2e Inline Automation Helper** in *Game Settings → Manage Modules*.

### Option B — Semi-Automatic Installation
### 

1. Open the Foundry Setup screen and navigate to the Add-on Modules tab.
2. Click the "Install Module" button.
3. Use the following Manifest URL: `https://github.com/jesuisfrog/pf2e-inline-automation-helper/blob/main/module.json`
4. Click "Install."

---

## Usage

1. Open any item, journal page, actor ability, etc. that uses a ProseMirror editor.
2. Click the D20 button located between the table and list buttons of the editor toolbar.
3. Choose the type of inline automation you need.
4. Fill in the form fields — the live preview at the bottom shows the syntax as you type.
5. Click **Insert** — the syntax is placed at the current cursor position.

---

## Style Guide Reference

This module implements the syntax documented in the official [PF2e Style Guide](https://github.com/foundryvtt/pf2e/wiki/Style-Guide).
Parameters are always emitted in the order specified by the guide.

### @Check parameter order
```
type | defense | against | rollerRole | dc | basic | showDC | adjustment | immutable | name | traits | options | overrideTraits
```

### @Damage formula rules
- Simple: `1d6[fire]`
- Needs parens when adding to a typed pool: `(1d6+3)[fire]`
- Precision/Splash use inner parens: `(2d6[precision])[slashing]`, `(5[splash])[fire]`
- Persistent has no inner parens: `1d6[persistent,fire]`
- Multi-pool: `5d6[acid],5d6[cold]`
---

## License

MIT — do whatever you like, attribution appreciated.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/B0B15MGC4)
