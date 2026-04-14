# Design Decision — eQuill Labs v2

**Decision date:** 2026-04-14
**Decided by:** Justin Parker (jparkerweb)
**Gate:** Phase 4 — Design-Direction Mockup Gate
**Status:** Locked

---

## Chosen Direction

**The Quill & Slash** (Option 4)

## Rationale

This direction matches the current brand logo. It's the only one of the four that is built natively around the eQuill identity — the `\\` slash as a first-class typographic glyph, the quill mark as a corner anchor, and the cyan→indigo gradient reserved exclusively for brand-significant moments (slash glyphs, heading underlines, focus rings, link decorations). The other three directions are competent editorial treatments, but they apply the eQuill brand as decoration; this one *is* the brand.

## Brand Preservation — Confirmed

- [x] `\\` glyph treated as a signature element, not incidental punctuation
- [x] `eQui\\ Labs` wordmark styled with the slash rendered distinctly (gradient-filled, Geist Mono)
- [x] Quill mark present as corner anchor (top-left)
- [x] "Labs" set in Instrument Serif italic as the display accent

## Palette (locked)

### Dark (`[data-theme="dark"]`)

| Token               | Value     |
| ------------------- | --------- |
| Background          | `#0C0E14` |
| Surface             | `#141822` |
| Border              | `#232838` |
| Text                | `#E8ECF4` |
| Muted text          | `#7A8499` |
| Accent (solid)      | `#5B4FE6` |
| Gradient stop 1     | `#00D4FF` |
| Gradient stop 2     | `#5B4FE6` |
| Gradient stop 3     | `#090979` |
| Focus ring          | `#00D4FF` |

### Light (`[data-theme="light"]`)

| Token               | Value     |
| ------------------- | --------- |
| Background          | `#F7F5EF` |
| Surface             | `#EDE9DE` |
| Border              | `#D6D0C0` |
| Text                | `#0E121A` |
| Muted text          | `#5A6275` |
| Accent (solid)      | `#5B4FE6` |
| Gradient (same)     | `#00D4FF → #5B4FE6 → #090979` |

## Type Stack (locked)

| Role        | Family                               | Notes                                       |
| ----------- | ------------------------------------ | ------------------------------------------- |
| Display     | Instrument Serif (italic, 400)       | Used for "Labs" in wordmark + italic accents |
| Body        | Geist (variable)                     | All body, UI, nav                           |
| Monospace   | Geist Mono (variable)                | Code, `\\` glyph, install blocks            |

## Signature Moments (Phase 5 must honor)

- `\\` as section dividers between major content blocks
- `\\` as list glyphs in featured project cards
- `\\` as gradient-filled hover underlines on project card titles
- Quill mark anchored at top-left as a small brand stamp
- Wordmark: CSS keyframe `quill-stroke` reveal animation on `\\` (optional; graceful static fallback)
- Gradient cyan→indigo **strictly reserved** for: `\\` glyphs, heading underlines, focus rings, link decorations. **Never** on buttons, backgrounds, or large fills.

## Reference

- The mockup that drove this decision is preserved at `specs/equill-labs-v2/design-reference.html` (copied from `mockups/quill-slash.html` before cleanup)
- Full palette source: `PLAN-DRAFT-20260412.md` §10.2, Option 4

---

**This document is the authoritative record of the design choice for subsequent phases.** Phase 5 components, Phase 6 polish, and Phase 8 verification must all trace their visual decisions back to this file.
