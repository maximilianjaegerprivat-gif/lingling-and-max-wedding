# Design system — Lingling & Max, Wedding 2027 (proposed)

This documents the **proposed** system for the "white and pristine" direction described in DESIGN_AUDIT.md. It is written to be implemented as plain CSS custom properties in css/styles.css with no build step, no web fonts, no third-party requests and no inline styles (the CSP stays as it is). Every token whose value changes from today's css/styles.css is marked **(was …)**; unmarked tokens are unchanged. Contrast ratios use the WCAG 2.x relative-luminance formula and were computed for this document.

Constraints honoured: system fonts only (Baskerville on Apple, Palatino/Garamond on Windows, Songti/Noto Serif for Chinese); three languages as sibling elements toggled by `html[data-lang]`; the page must read without JavaScript; the gallery stays empty; no logistics invented.

---

## 1. Colour tokens

### 1.1 Surfaces (paper)

| Token | Value | Role | Notes |
|---|---|---|---|
| `--paper` | `#ffffff` | page background, cards, text fields, header, stepper, toggle, copy button, lightbox QR border | **(was `--ivory #fbf8f1` for the page and `--white #fffdf8` for cards; both retired)** |
| `--paper-tint` | `#f4f6f1` | alternate section bands (Schedule, Hotels, Gifts), `.code` chip, `.pay` panel, checked `.choice`, stepper hover | **(was `--ivory-deep #f4efe3` for bands, `--gold-wash #f5efdf` for chip/hover/checked)** — a whisper of the brand green, R−B spread 3, not yellow; 1.09:1 against `--paper` |
| `--paper-accent` | `#e9ecdf` | RSVP band only | unchanged value of `--sage-pale`; keep the old name as an alias if preferred |
| `--sky-pale` | `#f3f6f7` | hero gradient mid-stop | **(was raw `#eef2f3` at styles.css 237)** |
| `--sky` | `#d6e3ec` | hero gradient end, hero haze, og-image background | **(was `--sky #dbe7f0`, unused, plus raw `#d6e3ec` at 237 and 251)** |
| `--section-bg` | set per section: `--paper` default, `--paper-tint` on `.section--schedule/--hotels/--gifts`, `--paper-accent` on `.section--rsvp` | used by the timeline dot halo and any element that must match its band | **(new; replaces the hard-coded `var(--ivory-deep)` halo at 381)** |
| retired | `--ivory`, `--ivory-deep`, `--parchment`, `--white`, `--gold-wash` | — | `--parchment` was never used |

### 1.2 Ink (text)

| Token | Value | Role | Contrast on `--paper` / `--paper-tint` / `--paper-accent` / `--sky-pale` |
|---|---|---|---|
| `--green` | `#2f3b27` | headings, nav links, bank values, primary button fill, footer background | 11.83 / 10.87 / 9.87 / 10.89 |
| `--green-deep` | `#243020` | primary button hover | 13.83 on white **(was a raw literal at 327)** |
| `--green-body` | `#3f4a36` | body text | 9.36 / 8.60 / 7.81 / 8.62 |
| `--green-muted` | `#5f6856` | leads, notes, asides, placeholders, unselected tab labels, day meta, dress code, timeline notes | 5.83 / 5.36 / 4.87 / 5.37 — AA everywhere **(was `#6b7461`: 4.89 / 4.49 / 4.08 / 4.50, failing on three surfaces)** |
| `--olive` | `#6f7f4f` | illustration only (olive.svg, olive-tree.svg) | not for text |
| `--sage` | `#8a9a6b` | illustration only; travel icons if a green icon is wanted | not for text |

### 1.3 Gold

| Token | Value | Role | Contrast |
|---|---|---|---|
| `--gold` | `#a17f2c` | the ampersand (`.amp`), ornament rule and heart, timeline line and dots, active nav underline, ghost-button border, checked-chip border, link underline colour | 3.76 on `--paper`, 3.45 on `--paper-tint`, 3.14 on `--paper-accent`, 3.15 on `--green` — passes 3:1 for large text and UI on every surface **(was `#b8963e`: 2.81 / 2.58 / 2.35 / 4.21)** |
| `--gold-text` | `#7a5f18` | eyebrows and all small capitals, focus ring, selected tab underline, radio `accent-color`, link hover | 6.04 / 5.55 / 5.04 on the papers; 1.96 on the footer (use `--gold-pale` there) |
| `--gold-pale` | `#e6d9b4` | footer links only | 8.42 on `--green` **(role reduced: was also the border on 18 components, `::selection`, lightbox button border)** |

### 1.4 Lines and alphas

| Token | Value | Role | Contrast |
|---|---|---|---|
| `--line` | `#e3e6de` | hairlines: cards, tab-list rule, dress rules, chips at rest, language toggle, copy button, card-link divider, header bottom, QR border, gallery tile | 1.26 on white — decorative, deliberately quiet **(new; replaces `--gold-pale` as border)** |
| `--line-strong` | `#8f978a` | text fields, textareas, selects, stepper frame at rest | 3.02 on white — WCAG 1.4.11 component boundary **(new)** |
| `--paper-rgb` | `255 255 255` | for translucent paper: header `rgb(var(--paper-rgb) / .86)`, ghost button `/ .8` | **(was `rgba(251,248,241,.88)` at 168 and `rgba(255,253,248,.75)` at 328)** |
| `--gold-rgb` | `161 127 44` | optional 25 % gold hairline on the header; lightbox image border `/ .4` | **(was `rgba(184,150,62,…)` at 171, 459, 500, 544)** |
| `--green-rgb` | `47 59 39` | shadows | **(was expanded literals at 35–36, 174)** |
| `--shadow-soft` | `0 12px 30px -24px rgb(var(--green-rgb) / .3)` | hover states only (gallery tile, scrolled header) | **(role changed: was resting shadow on four cards; `--shadow` retired)** |
| `--focus-ring` | `2px solid var(--gold-text)` | every `:focus-visible` on light surfaces; `outline-offset: 3px` on links/buttons, `0` on fields | 6.04 on white **(was a 3 px 22 % gold glow at 1.22:1 on fields)** |
| `--focus-ring-dark` | `2px solid var(--gold-pale)` | focus inside `.site-footer` and `.lightbox` | 8.42 on green |
| `::selection` | `var(--paper-accent)` | — | **(was `--gold-pale`)** |

### 1.5 Footer (on `--green`)

| Use | Value | Contrast on `#2f3b27` |
|---|---|---|
| names | `#ffffff` | 11.83 **(was `--ivory`)** |
| body text | `--footer-text: #e9ece4` | 9.90 **(was `--ivory-deep`)** |
| date, links | `--gold-pale` | 8.42 |
| ornament | `--gold` | 3.15 (decorative) |
| small print | `rgb(255 255 255 / .7)` → blends to `#c1c4be` | 6.71 **(was `rgba(244,239,227,.65)` at 5.38)** |

### 1.6 Assets to recolour in the same commit

- `<meta name="theme-color" content="#ffffff">` in index.html (9) and thanks.html (10) **(was `#fbf7f1` / `#fbf8f1`)**.
- images/favicon.svg background rect `#ffffff` **(was `#fbf8f1`)**, re-export favicon.png and apple-touch-icon.png.
- images/og-image.svg background `#ffffff → #f3f6f7 → #d6e3ec` **(was `#fbf8f1` / `#e9eff3`)**; export as JPEG q85 under 300 KB **(was a 1.01 MB RGBA PNG)**.
- images/olive.svg olives `#4f5b2e` with highlight `--sage` **(was `#9aa84a` / `#d9df9a`)**; images/olive-tree.svg plaque flat `--gold` with a 1 px `--gold-text` edge, highlight `#d9c88f` **(was `#e0c26a` / `#e6cc7a` / `#c9a648` / `#fff3c4`)**; ground `--paper-accent` / `--sage` **(was `#b7c78f` / `#9fb27a`)**.

---

## 2. Typography

### 2.1 Families (system stacks)

```css
--font-serif: Baskerville, "Palatino Linotype", "Book Antiqua", Palatino, Garamond, Georgia, "Times New Roman", serif;
```
**(was `Baskerville, Garamond, "Cormorant Garamond", "EB Garamond", "Palatino Linotype", "Book Antiqua", Palatino, Georgia, "Times New Roman", serif`)** — Palatino moves ahead of Garamond so Windows gets the sturdier, larger-x-height face; the two Garamond webfont names are dropped because they are not system fonts (optional: keep them if the owner wants them for guests who installed them).

```css
html[data-lang="zh"] {
  --font-serif: Baskerville, "Palatino Linotype", "Book Antiqua", Palatino, Georgia,
                "Songti SC", "Songti TC", "Noto Serif CJK SC", "Noto Serif SC", "Source Han Serif SC", SimSun, serif;
}
```
**(was the same without `"Noto Serif SC"`)** — Latin faces first so digits and names render in Baskerville; CJK glyphs fall through to Songti on Apple, Noto Serif on Android/Linux, SimSun on Windows.

`--font-sans` **(declared today, never used)**: remove unless the owner decides to introduce a sans-serif for UI text (open decision in the audit). The proposed system is all-serif.

Rendering: `body { -webkit-font-smoothing: auto }` **(was `antialiased`)** — test on white; keep `antialiased` on `.site-footer` where light text sits on dark. Optional: `font-size-adjust: 0.42` on body to equalise apparent size between Baskerville, Palatino and Noto Serif (progressive; ignored where unsupported).

### 2.2 Roles

| Role | Family | Style | Colour | Where |
|---|---|---|---|---|
| Display names | serif | 400, `line-height: 1`, `letter-spacing: -.01em`; `.amp` italic `--gold` | `--green` | hero h1, brand, footer names |
| Headings h2–h4 | serif | 400, `line-height: 1.1` (`1.25` in zh), `text-wrap: balance` | `--green` | section titles, day/venue titles, card titles, timeline titles |
| Lead | serif | `line-height: 1.55`, `text-wrap: pretty`, upright | `--green-muted` | section intros **(gifts lead was italic at 478 — now upright like the others)** |
| Body | serif | 1.125rem / 1.65, upright | `--green-body` | paragraphs, form text, bank values (`--green`) |
| Note | serif | `--note` .95rem, italic in EN/DE, **upright in zh** | `--green-muted` | hero place line, dress code, timeline/venue/card asides, hints, figcaption, "optional", footer small print |
| Caps M | serif | `--caps-m` .8rem, `--track` .2em, uppercase | `--green` (nav, buttons) or `--gold-text` (footer date) | nav links, buttons, language toggle, footer date |
| Caps S | serif | `--caps-s` .75rem, `--track-s` .16em, uppercase | `--gold-text` | countdown labels, copy buttons, bank row labels, tab dates, dress label, card meta, total label, timeline place |
| Eyebrow (signature) | serif | .8rem, `--track-signature` .28em, uppercase | `--gold-text` | section eyebrows, hero eyebrow, venue eyebrow |
| Hero date | serif | `--display-date`, `.3em` (zh .15em), uppercase | `--gold-text` | `.hero__date` |
| Form label | serif | 1rem, sentence case, `.01em` | `--green` | `.form__label`, `legend` **(was .78rem uppercase .18em)** — decision pending |
| Numerals | serif | `font-variant-numeric: tabular-nums` | — | countdown, times, totals, IBAN (unchanged) |

Rules that go away: the fourteen per-component caps definitions (styles.css 99–106, 192, 209, 294, 320, 354, 373, 388, 432, 502, 512, 514, 537, 569) collapse onto the three caps roles above; the ten `font-style: italic; color: var(--green-muted)` rules (282, 389, 410, 434, 449, 478, 504, 518–519, 538, 561) collapse onto `.note`; the `> p[lang]` selectors (389, 410, 434, 487) are replaced by explicit classes (`.timeline__note`, `.venue__note`, `.card__note`).

### 2.3 Chinese overrides (one block, after the language rules)

```css
html[data-lang="zh"] [lang|="zh"],
html[data-lang="zh"] .form__input::placeholder { font-style: normal; }   /* no faux-italic Songti */
html[data-lang="zh"] { font-synthesis-style: none; --track-signature: .15em; --track: .1em; --track-s: .08em; --caps-s: .8rem; }
html[data-lang="zh"] :is(h1, h2, h3, h4) { line-height: 1.25; }
html[data-lang="zh"] .hero__date, html[data-lang="zh"] .hero__headline { letter-spacing: .15em; }
```
Language tag: `lang="zh-Hans"` on the spans and on `<html>` (js/head.js, js/main.js `root.lang`), with the CSS hide/show selectors at 146–150 switched to `[lang|="zh"]` so both forms match. `data-lang="zh"` stays as the CSS hook.

---

## 3. Type scale (clamp values, 16 px root; evaluated at 375 / 768 / 1440 px)

| Token | Value | 375 | 768 | 1440 | Notes |
|---|---|---|---|---|---|
| `--h1` | `clamp(2.6rem, .6rem + 9vw, 7.75rem)` | 43.4 | 78.7 | 124 | hero names; one line at 375 (unchanged; optional floor 2.85rem is an open item) |
| `--h2` | `clamp(2.1rem, 1.5rem + 2.6vw, 3.2rem)` | 33.8 | 44 | 51.2 | section titles (unchanged) |
| `--h3-display` | `clamp(1.9rem, 1.5rem + 1.6vw, 2.6rem)` | 30.4 | 36.3 | 41.6 | `.day__title`, `.venue__name`, `.site-footer__names` **(was `.day__title` 2–2.9rem, `.venue__name` 1.9–2.6rem)** |
| `--h3` | `clamp(1.55rem, 1.25rem + 1.2vw, 2.1rem)` | 24.8 | 29.2 | 33.6 | `.card__title`, `.olive__title`, `.travel__title` (unchanged) |
| `--h4` | `1.3rem` | 20.8 | 20.8 | 20.8 | timeline titles **(was 1.35rem at 387 — snapped to h4)** |
| `--page-title` | `clamp(2.4rem, 1.6rem + 3.5vw, 4rem)` | 38.4 | 52.5 | 64 | thanks.html h1 (unchanged) |
| `--lead` | `clamp(1.2rem, 1.05rem + .6vw, 1.4rem)` | 19.2 | 21.4 | 22.4 | leads (unchanged) |
| `--text-body` | `1.125rem` / `--leading-body: 1.65` | 18 | 18 | 18 | body (unchanged) |
| `--note` | `.95rem` | 15.2 | 15.2 | 15.2 | notes **(was .85 / .9 / .95 / .98 / 1rem across ten rules)** |
| `--display-date` | `clamp(1.15rem, 1rem + .9vw, 1.7rem)` | 18.4 | 23 | 27.2 | hero date (unchanged) |
| `--display-number` | `clamp(2rem, 1.2rem + 3.6vw, 3.4rem)` | 32 | 46.8 | 54.4 | countdown values (unchanged) |
| `--display-total` | `1.7rem` | 27.2 | 27.2 | 27.2 | olive total (unchanged) |
| `--tab-day` | `clamp(1.15rem, 1rem + .7vw, 1.5rem)` | 18.4 | 21.4 | 24 | tab day names (unchanged) |
| `--caps-m` | `.8rem` | 12.8 | 12.8 | 12.8 | **(was .72–.8rem)** |
| `--caps-s` | `.75rem` (zh `.8rem`) | 12 | 12 | 12 | **(was .64–.72rem; nothing below 12 px any more)** |
| `--form-label` | `1rem` | 16 | 16 | 16 | **(was .78rem)** |

Tracking tokens: `--track-signature: .28em` (eyebrow), `--track: .2em` (caps M, buttons, hero headline), `--track-s: .16em` (caps S), `--track-fix: .3em` (optical `padding-left` on centred tracked lines, folded into the centred caps style instead of being repeated at 275 and 280). **(was eight values: .12 .14 .16 .18 .2 .22 .28 .3em)**

---

## 4. Spacing scale

```css
--s1: .25rem;  --s2: .5rem;  --s3: .75rem;  --s4: 1rem;  --s5: 1.5rem;  --s6: 2.5rem;  --s7: 4rem;
--section-pad: clamp(4rem, 3rem + 5vw, 7.5rem);      /* (was inline at 335) */
--section-pad-thin: clamp(2.5rem, 2rem + 3vw, 4.5rem); /* new: sections that contain only a head */
--head-gap: clamp(2rem, 1.5rem + 2vw, 3.5rem);        /* (was inline at 336) */
--card-pad: clamp(1.5rem, 1rem + 2vw, 2.5rem);        /* (was three recipes: 2.5rem, 2.75rem, 1.7/1.6/1.5rem fixed) */
--footer-pad: clamp(3rem, 2rem + 4vw, 5.5rem);
```

Mapping today's 20 gap values: `.1/.15/.2/.25` → `--s1`; `.35/.4/.5/.55/.6` → `--s2`; `.75/.8/.9` → `--s3`; `1` → `--s4`; `1.2/1.25/1.3/1.4/1.5` → `--s5` (form rows, card grids, travel list, venue, olive); `1.75` → `--s5` or `--s6` by eye; `2.5` → `--s6`; the no-JS day gap `4rem` → `--s7`. Hero internals (`.hero__content` padding, countdown gap) keep their own clamps.

---

## 5. Layout widths, grid behaviour, breakpoints

### 5.1 Widths

| Token | Value | Use |
|---|---|---|
| `--container` | `72rem` | header inner, hero, schedule, venue, hotels (unchanged) |
| `--wide` | `60rem` | gifts section **(new; was `--narrow` 46rem, which left ~39 characters per line for the olive copy)** |
| `--narrow` | `48rem` | schedule `.day`, RSVP **(was 46rem; `.day` already used 48rem — they now share one token)** |
| `--measure` | `42rem` | section leads, tab list (was 40rem), thanks card (was 36rem) |
| `--hero-content` | `58rem` | hero text block (unchanged) |
| `--cards-2` | `54rem` | two-card hotel grid (unchanged) |
| `--header-h` | `7.5rem` below 60em, `4.5rem` from 60em | sticky header height **(was hard-coded at 46, 49, 218, 236, 240, 574)**; drives `scroll-padding-top: calc(var(--header-h) + .75rem)`, hero `min-height: calc(100svh - var(--header-h))`, `.page` min-height |
| container padding | `1rem`, `2rem` from 40em | unchanged |

### 5.2 Breakpoints (three, mobile-first)

| Breakpoint | What changes |
|---|---|
| `≥ 40em` (640 px) | container padding 2rem; timeline gains the wider time column (icons, if kept, appear here); gallery 3 columns |
| `≥ 50em` (800 px) | two-column layouts: venue 5fr/7fr, hotel cards 2–3 columns, `.olive` `minmax(0, 18rem) minmax(0, 1fr)` with sticky art, hero olive sprigs visible **(was 47.99/48em and 56em)** |
| `≥ 60em` (960 px) | single-row header (brand · nav · toggle + RSVP), `--header-h: 4.5rem`, lightbox button spacing **(was 66em for the header/hero and 60em for the lightbox; the dead 60–65.99em rule at 226–228 is removed)** |

Container query: `.pay { container-type: inline-size }` with `@container (min-width: 30rem)` for the QR-beside-IBAN layout **(was 34rem, unreachable on desktop in the 46rem container)** — verify at 768 and 1440 after the width change.

### 5.3 Grid behaviour

- Header: `grid-template-columns: 1fr auto auto` below 60em (brand · RSVP button · toggle), nav on row 2 spanning all columns, centred on tablets; from 60em `auto minmax(0, 1fr) auto` with the nav centred in the middle column and scrolling horizontally only if DE labels outgrow it.
- Hero: `grid-template-rows: 1fr var(--band)` with `--band: clamp(16rem, 91vw, 54rem)` (unchanged; optional cap at 44rem on desktop once the original photo exists).
- Sections: `.container` → `.section__head` (centred, `--head-gap` below) → content; alternate `--paper` / `--paper-tint`; RSVP on `--paper-accent`.
- Timeline: `3.9rem 1fr` → `4.75rem 1fr` at 40em (`4.75rem 1fr auto` only if icons are kept); dot halo `var(--section-bg)`.
- Forms: single column, `gap: var(--s5)`; `.olive-form__pick` wraps; chips wrap.

---

## 6. Buttons

| Variant | Fill | Border | Text | Hover | Size |
|---|---|---|---|---|---|
| `.btn--primary` | `--green` | `--green` | `#fff` **(was `--ivory`)** | `--green-deep` **(token, was raw)** | `min-height: var(--control-h)` 3rem, padding `.85rem 1.6rem`, `--caps-m`, `--track`, `--radius` |
| `.btn--ghost` | `rgb(var(--paper-rgb) / .8)` **(was `rgba(255,253,248,.75)`)** | `--gold` (3.76:1 boundary) | `--green` | fill `--paper`, text and border `--gold-text` | as primary |
| `.btn--outline` | `--paper` | `--line` → hover `--gold` | `--green` → hover `--gold-text` | — | **(new name for the look of `.btn--small`, which mixed size and style)** |
| `.btn--sm` | inherits variant | — | — | — | padding `.65rem 1.1rem`, `--caps-s`, `min-height: 2.75rem` (44 px) **(was 38 px)** |
| `.copy` | = `.btn .btn--sm .btn--outline` | `--line` | `--green` | border `--gold` | `min-height: 2.25rem`; `2.75rem` under `(pointer: coarse)` **(was 56×28 px, 10.2 px text)** |
| `.lang-toggle__btn` | transparent; pressed `--green` with `#fff` text | — | `--green-muted` → hover `--green` | — | padding `.55rem .85rem`, `--caps-m`, pill radius **(was 41×29 px, 11.5 px text)** |
| `.stepper__btn` | transparent; hover `--paper-tint` | — | `--green` → hover `--gold-text` | — | `width: 2.75rem; flex: none` **(was 2.6rem, collapsing to 28 px)** |

Common: `font: inherit`, `line-height: 1.2`, `transition: background .2s, color .2s, border-color .2s var(--ease)`; the `translateY(-1px)` hover lift is removed **(was at 324)**; `:focus-visible { outline: var(--focus-ring); outline-offset: 3px }`. Hero CTAs below 48em: `.hero__actions .btn { flex: 1 1 12rem; max-width: 20rem }` so RSVP and Add-to-calendar are the same width.

Links: `--green`, underline `--gold` 1 px at `.18em` offset; hover `--gold-text` (unchanged). Footer links `--gold-pale`, hover `#fff`.

---

## 7. Form elements

| Element | Spec |
|---|---|
| `.form__label`, `legend` | `--form-label` 1rem, sentence case, `--green`, `letter-spacing: .01em`; `.form__optional` as `--note` upright "(optional)" in `--green-muted` **(was .78rem tracked caps)** |
| `.form__input` (input, textarea, select) | `font: inherit; line-height: 1.4; min-height: var(--control-h)`; padding `.7rem .9rem`; background `--paper` **(was `--ivory`)**; border `1px solid var(--line-strong)` **(was `--gold-pale` at 1.38:1)**; color `--green`; radius `--radius` |
| focus | `:focus-visible { outline: var(--focus-ring); outline-offset: 0; border-color: var(--gold-text) }` — no `outline: none`, no glow **(was `outline: none` + 2.8:1 border + 1.2:1 glow at 544; the inset select glow at 500 is deleted)** |
| invalid | `:user-invalid { border: 2px solid var(--gold-text) }` plus a `.form__error` line (`--note`, upright, `--green-body`) revealed with `:user-invalid ~ .form__error`; native validation stays (no `novalidate`) |
| placeholder | `color: var(--green-muted)` (5.83:1) **(was `#9aa08f` at 2.69:1)**; italic in EN/DE, upright in zh |
| textarea | `resize: vertical; min-height: 3.5rem` (unchanged) |
| `.choice` (radio pills) | background `--paper` **(was `--ivory`)**, border `1px solid var(--line)`, padding `.7rem 1.1rem .7rem .85rem`, 54 px tall; hover border `--gold`; checked: border `--gold`, background `--paper-tint` **(was `--gold-wash`)**; `input { accent-color: var(--gold-text) }`; `:has(input:focus-visible) { outline: var(--focus-ring); outline-offset: 2px }` |
| `.stepper` | border `1px solid var(--line-strong)` **(was `--gold-pale`)**, background `--paper` **(was `--ivory`)**, select `min-width: 0`, buttons `flex: none` 2.75rem; `.js .stepper__select { border-inline: 1px solid var(--line) }` |
| `.pay` panel | background `--paper-tint` **(was `--ivory`)**, border `--line`, padding `var(--s4) calc(var(--s4) + .2rem)`; `.bank__row dt` in `--caps-s` |
| submit state (JS) | form `aria-busy="true"`, button disabled, label swapped to "Sending… / Wird gesendet… / 发送中…"; native POST unchanged |
| status | `role="status"` on `.olive-form__total`; a visually-hidden `role="status"` span for "Copied / Kopiert / 已复制" |
| honeypot | unchanged (`.form__honeypot` off-screen, `aria-hidden`) |

Guests select: first option `value="" disabled selected` ("Please choose / Bitte wählen / 请选择"), `required`. Rows that only matter when attending (guests, names, dietary) can be hidden with `.form:has(input[name="attending"][value="no"]:checked) .form__row--attending { display: none }` — the same `:has()` pattern as the payment panels; older engines simply show them.

---

## 8. Cards and panels

One shell, composed by the four card-like components:

```css
.card-shell, .card, .venue__card, .olive, .form {
  background: var(--paper);                /* (was --white #fffdf8) */
  border: 1px solid var(--line);           /* (was --gold-pale) */
  border-radius: var(--radius);
  padding: var(--card-pad);                /* (was three recipes) */
  box-shadow: none;                        /* (was --shadow-soft on three, --shadow on .form) */
}
```

- Hotel `.card`: flex column, `gap: var(--s2)`, `.card__links` divider `1px solid var(--line)` with `padding-block: var(--s2)` on links for 44 px targets; `.card__meta` in `--caps-s`.
- `.venue__card`: eyebrow, `--h3-display` name, `.address` in `--green-muted` upright, description upright `--green-body` **(was italic note)**, outline button.
- `.olive`: two columns from 50em (`minmax(0, 18rem) minmax(0, 1fr)`, gap `--s6`), art sticky at `calc(var(--header-h) + var(--s5))`.
- `.form`: `display: grid; gap: var(--s5)`.
- `.code` chip: `--paper-tint` fill, `--line` border, `--radius-sm`, `.14em` tracking, `white-space: nowrap`; the sentence ends before the chip, or chip + period are wrapped together, so no stranded full stop.
- `.dress`: `--note`, rules `1px solid var(--line)` top and bottom, label in `--caps-s`.
- Tabs: list rule `1px solid var(--line)` **(was `--gold-pale`)**; tab text `--green-muted`, selected day `--green`, selected underline `2px solid var(--gold-text)` **(was 1 px `--gold`)**, dates in `--caps-s`.
- Timeline: line `--gold` at `.6` opacity, 9 px dots in `--gold` with `0 0 0 4px var(--section-bg)` halo; times `--green` tabular; place line `--caps-s`; notes `.note`; per-event icons removed on desktop (or, if kept, 2.25rem, `--sage`, placed beside the title).
- Ornament: `--gold`, rule `3.25rem × 1px` at full opacity **(was `.8` — too faint on white)**, heart 15 px; defined once as an SVG `<symbol>` and referenced with `<use>`; order heading → ornament everywhere (hero included) unless the owner prefers the current hero order.
- Header: `rgb(var(--paper-rgb) / .86)` + `backdrop-filter: blur(12px)` **(was ivory .88 + `saturate(140%)`)**; `border-bottom: 1px solid var(--line)` (or `rgb(var(--gold-rgb) / .25)` as the one deliberate gold hairline — owner's choice); `.is-scrolled` shadow `--shadow-soft`.
- Footer: `--green` background, text `--footer-text`, ornament `--gold`, names `#fff`, date and links `--gold-pale`, small print `rgb(255 255 255 / .7)`, `padding: var(--footer-pad) 0`.
- Lightbox (unchanged in behaviour): backdrop `rgb(31 38 25 / .95)`, image border `rgb(var(--gold-rgb) / .4)`, buttons `2.75rem` round with `--focus-ring-dark`.

---

## 9. Image treatments

- **Hero band**: `.hero__art { width: 100%; height: var(--band); object-fit: cover; object-position: center 35% }` under a `#fff → --sky-pale 45% → --sky 100%` gradient **(was from `--ivory`)**, with the haze `::before` from `--sky` to transparent. When the original arrives: export 800 / 1400 / 2000 px as AVIF with JPEG fallback (`<picture>` + `srcset`/`sizes="100vw"`), keep the church in the right third, 3:2 or 16:9 crop, budgets ≤120 KB (1400 AVIF) / ≤220 KB (1400 JPEG); use a new filename so the 7-day image cache does not serve the placeholder.
- **Olive sprigs** (hero corners, ≥50em): `width: clamp(7rem, 11vw, 11rem); opacity: .6` **(was `clamp(9rem, 16vw, 15rem)` at `.95`)**, re-tinted; or redrawn as thin strokes; or removed (open decision).
- **Olive-tree illustration**: `width: min(100%, 22rem)`, `loading="lazy"`, meaningful `alt` with `data-alt-de/zh`; recoloured toward the brand gold and `--olive`/`--sage`.
- **Social card**: 1200×630 JPEG q85 under 300 KB, white/sky background, same names/ampersand/ornament; `og:image:type image/jpeg`.
- **Favicons**: white tile, `--gold` ampersand, `--green` letters.
- **QR**: 164 CSS px box, `6px solid var(--paper)` border, `1px solid var(--line)` outside, no shadow **(was `--shadow-soft`)**; canvas scale computed from `devicePixelRatio` so modules are whole device pixels; `image-rendering: pixelated` kept.
- **Gallery** (when filled): tiles `aspect-ratio: 4 / 3`, `--paper-tint` background, `1px solid var(--line)`, `4px` inner padding, hover `translateY(-2px)` + `--shadow-soft`, image `scale(1.03)`; `.gallery__credit` as `.note`.
- Decorative images use `alt=""`; inline SVG icons are `aria-hidden="true"`.

---

## 10. Motion principles

- Entrance: `.hero__content > *` rise `opacity 0 → 1, translateY(12px) → 0`, `.9s var(--ease)`, staggered 60 ms, only under `@media (prefers-reduced-motion: no-preference)`; `.hero.is-settled` cancels it as a safety net (unchanged).
- Transitions: `.2s var(--ease)` for colour, background and border; `.3s` for the header shadow; `.6s` for gallery image scale. No transform on button hover **(was `translateY(-1px)`)**.
- Scroll: `scroll-behavior: smooth` only under `no-preference`; in JS use `behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'` for `navEl.scrollTo`.
- Countdown: tick once per minute without a seconds unit (recommended), or at minimum hide the seconds unit and switch to a 60 s interval under reduced motion.
- Global kill switch under `prefers-reduced-motion: reduce` (animation and transition durations to `.001ms`, `scroll-behavior: auto`) stays as is (styles.css 580–585).
- `--ease: cubic-bezier(.2, .7, .2, 1)` unchanged.

---

## 11. Responsive rules

- Mobile-first; no horizontal scroll at 320–1920 px (`body { overflow-x: hidden }` stays as a guard, not a crutch); re-check at 320 px / 400 % zoom after the header change.
- Header: two rows below 60em (brand · RSVP outlined button · toggle / nav strip), ~60 px target height; the nav strip shows a fade mask and resets to `scrollLeft 0` when no section is current; single row from 60em.
- Hero: `min-height: calc(100svh - var(--header-h))` with a `100vh` fallback declared first; band `clamp(16rem, 91vw, 54rem)`; CTAs equal width below 48em; place line split into time / place parts with `white-space: nowrap` around the town name; `text-wrap: balance` on `.hero__place` and `.site-footer__date`.
- Type: body fixed at 18 px, headings fluid; labels never below 12 px (zh 12.8 px); measures 42–48rem for running text, 60rem for the gifts column.
- Grids: single column by default; venue, cards and olive split at 50em; pay panel splits by container width at 30rem.
- Touch: `@media (pointer: coarse)` raises copy buttons and toggle to 2.75rem; all other interactive elements are ≥44 px by default.
- Print: header, hero art, sprigs, countdown, toggle and lightbox hidden; both days listed; `--section-pad` 1.5rem (unchanged).
- Languages: DE is the widest (nav 805 px at 375); layouts must be checked in DE; ZH wraps character-wise, so `text-wrap: balance` and the nowrap spans matter more there.

---

## 12. Accessibility standards

Target: **WCAG 2.2 AA** on every surface, verified by computation for colour and by keyboard for focus.

- Text contrast ≥ 4.5:1 for all normal text including placeholders, leads, notes and tab labels (`--green-muted` 4.87:1 minimum on the accent band); ≥ 3:1 for large text and the ampersand (`--gold` 3.14:1 minimum).
- Non-text contrast ≥ 3:1 for field boundaries (`--line-strong` 3.02:1), focus indicators (`--gold-text` 6.04:1 light, `--gold-pale` 8.42:1 dark) and the ghost-button border (`--gold` 3.76:1); decorative hairlines (`--line`) are exempt by design and never the only boundary of a control.
- Focus visible on everything: a single `--focus-ring`; no `outline: none` anywhere (styles.css 360 and 544 removed); tab panels not focusable (main.js 282 removed).
- Targets: ≥ 24×24 everywhere, ≥ 44×44 on touch for the controls guests use (toggle, copy, stepper, card links, footer link).
- Structure: landmarks, `aria-labelledby` sections, h1 > h2 > h3 > h4, skip link to `#main`, `scroll-padding-top` equal to the header so focused targets are not obscured.
- Forms: visible persistent labels, fieldset/legend for radio groups, `autocomplete`, native validation plus `:user-invalid` styling and a text message, `role="status"` for the live total and copy confirmation, `aria-busy` while sending.
- Language: `lang="zh-Hans"` for Simplified Chinese, `html[lang]` and `<title>` follow the toggle, translated `aria-label`s (nav, tabs list, brand, dialog, stepper, QR) and `alt` via `data-*-de/zh`; `aria-current="location"` for the active section.
- Motion: everything above under `prefers-reduced-motion`; no auto-updating seconds (recommended).
- No-JS: the full page in English with all days listed, static .ics, native forms, CSS-only payment panels; nothing depends on JS to be readable.
- Forced colours: borders exist on every card, field and button so they survive Windows High Contrast; icons use `currentColor`. Auto-dark: `color-scheme: only light` on `html` and `<meta name="color-scheme" content="only light">` so Android Chrome does not invert the palette.
- External links that open a new tab carry a visually-hidden "(opens in a new tab)" in three languages (optional).

---

## Appendix A — proposed `:root` block (drop-in)

```css
:root {
  /* paper */
  --paper: #ffffff;            /* was --ivory #fbf8f1 / --white #fffdf8 */
  --paper-tint: #f4f6f1;       /* was --ivory-deep #f4efe3 / --gold-wash #f5efdf */
  --paper-accent: #e9ecdf;     /* = --sage-pale */
  --sage-pale: var(--paper-accent);
  --sky-pale: #f3f6f7;         /* was raw #eef2f3 */
  --sky: #d6e3ec;              /* was #dbe7f0 (unused) + raw #d6e3ec */
  --section-bg: var(--paper);
  --paper-rgb: 255 255 255;

  /* ink */
  --green: #2f3b27;
  --green-deep: #243020;       /* was raw */
  --green-body: #3f4a36;       /* 9.36:1 on white */
  --green-muted: #5f6856;      /* was #6b7461; 5.83 white / 5.36 tint / 4.87 accent */
  --green-rgb: 47 59 39;
  --olive: #6f7f4f;            /* illustration */
  --sage: #8a9a6b;             /* illustration */

  /* gold */
  --gold: #a17f2c;             /* was #b8963e; 3.76:1 on white */
  --gold-text: #7a5f18;        /* 6.04:1 on white */
  --gold-pale: #e6d9b4;        /* footer links only */
  --gold-rgb: 161 127 44;

  /* lines, focus, shadow */
  --line: #e3e6de;             /* new: hairlines (was --gold-pale borders) */
  --line-strong: #8f978a;      /* new: field borders, 3.02:1 */
  --focus-ring: 2px solid var(--gold-text);
  --focus-ring-dark: 2px solid var(--gold-pale);
  --shadow-soft: 0 12px 30px -24px rgb(var(--green-rgb) / .3);   /* hover only; --shadow retired */
  --footer-text: #e9ece4;      /* was --ivory-deep on green */

  /* type */
  --font-serif: Baskerville, "Palatino Linotype", "Book Antiqua", Palatino, Garamond, Georgia, "Times New Roman", serif;
  --text-body: 1.125rem; --leading-body: 1.65;
  --h1: clamp(2.6rem, .6rem + 9vw, 7.75rem);
  --h2: clamp(2.1rem, 1.5rem + 2.6vw, 3.2rem);
  --h3-display: clamp(1.9rem, 1.5rem + 1.6vw, 2.6rem);
  --h3: clamp(1.55rem, 1.25rem + 1.2vw, 2.1rem);
  --h4: 1.3rem;
  --lead: clamp(1.2rem, 1.05rem + .6vw, 1.4rem);
  --note: .95rem;
  --caps-m: .8rem; --caps-s: .75rem; --form-label: 1rem;
  --track-signature: .28em; --track: .2em; --track-s: .16em; --track-fix: .3em;
  --display-date: clamp(1.15rem, 1rem + .9vw, 1.7rem);
  --display-number: clamp(2rem, 1.2rem + 3.6vw, 3.4rem);

  /* spacing */
  --s1: .25rem; --s2: .5rem; --s3: .75rem; --s4: 1rem; --s5: 1.5rem; --s6: 2.5rem; --s7: 4rem;
  --section-pad: clamp(4rem, 3rem + 5vw, 7.5rem);
  --section-pad-thin: clamp(2.5rem, 2rem + 3vw, 4.5rem);
  --head-gap: clamp(2rem, 1.5rem + 2vw, 3.5rem);
  --card-pad: clamp(1.5rem, 1rem + 2vw, 2.5rem);
  --footer-pad: clamp(3rem, 2rem + 4vw, 5.5rem);

  /* layout */
  --container: 72rem; --wide: 60rem; --narrow: 48rem; --measure: 42rem;   /* --narrow was 46rem */
  --header-h: 7.5rem;
  --control-h: 3rem;
  --radius: 4px; --radius-sm: 2px; --radius-pill: 999px;
  --ease: cubic-bezier(.2, .7, .2, 1);
}
@media (min-width: 60em) { :root { --header-h: 4.5rem; } }
html[data-lang="zh"] {
  --font-serif: Baskerville, "Palatino Linotype", "Book Antiqua", Palatino, Georgia, "Songti SC", "Songti TC", "Noto Serif CJK SC", "Noto Serif SC", "Source Han Serif SC", SimSun, serif;
  --track-signature: .15em; --track: .1em; --track-s: .08em; --caps-s: .8rem;
  font-synthesis-style: none;
}
```

## Appendix B — literals to replace when the tokens land (checklist)

styles.css: 57 (`--ivory` body), 88 (`::selection`), 123–124 (`.code`), 159 (skip link text), 168–171 (header rgba, saturate, gold border), 174 (shadow), 188 (toggle), 196 (pressed text `--ivory`), 237 (hero gradient), 251 (haze), 326–330 (buttons), 338–339 (bands), 381 (dot halo), 405, 427, 435, 441–442, 459, 462, 481, 493, 495, 497–500, 506, 514, 517, 531, 541, 544–545, 552, 556, 564–571 (footer), all `var(--gold-pale)` borders. index.html 9, thanks.html 10 (`theme-color`). images/favicon.svg, og-image.svg, olive.svg, olive-tree.svg (section 1.6). README "Social preview" recipe.


---

## Implementation notes (27 October 2026)

The stylesheet now follows this document with these deltas:

- Token names in `css/styles.css`: `--paper`, `--paper-tint` (#f4f6f1), `--paper-sage` (#e9ecdf, the RSVP band; the document calls it `--paper-accent`), `--paper-rgb`, `--green`, `--green-deep`, `--green-body`, `--green-muted` (#5f6856), `--gold` (#a17f2c, with `--gold-ink` as an alias), `--gold-text`, `--gold-pale` (footer links only), `--sage` (icons, illustration), `--line`, `--line-strong`.
- Type scale tokens are named `--fs-display` (hero names, floor raised to 2.85rem), `--fs-1` (h2), `--fs-2` (day and venue titles, footer names), `--fs-3` (card, olive, travel titles), `--fs-4` (timeline titles), `--fs-lead`; capitals in three sizes `--label-s` / `--label-m` / `--label-l` with matching `--track-*`, all reduced under `html[data-lang="zh"]`.
- Spacing scale `--s1` … `--s8` plus `--space-section`, `--space-head`, `--pad-panel`; widths `--measure` 42rem, `--narrow` 48rem, `--container` 72rem (gifts use the container with a 60rem cap).
- Breakpoints: 40em, 50em, 66em (header single row). Section bands are set with `.section--tint` / `.section--sage` classes rather than per-section names; the hero gradient starts at white.
- Panels share `.panel` (white, 1px `--line`, 4px radius, no resting shadow); the only shadow left is the scrolled header.
- Timeline icons sit in medallions on the gold line instead of a third column; the countdown has no seconds; the heart ornament is a bookend (hero, RSVP, footer).
- Decisions taken from section 10 of the audit: one gold everywhere; white/tint alternation with the sage RSVP band; sprigs reduced; ornament rationed; name order kept as "Lingling & Max"; all-serif; sentence-case form labels; icons kept as medallions; no card shadows; 4px radius; RSVP before Gifts; tabs with Saturday default; countdown per minute; gallery kept as a compact band with "Photos will follow"; hero keeps "Wedding 2027" and "We are getting married" as an italic line; footer privacy line reworded; `?lang=` links instead of browser-language detection; email stays required on the RSVP.
