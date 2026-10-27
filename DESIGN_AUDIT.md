# Design audit — Lingling & Max, Wedding 2027

Creative director's consolidated audit of the static wedding site in this folder (index.html, thanks.html, css/styles.css, js/*, images/*, netlify.toml). It reconciles seven specialist audits (visual/browser, typography and colour, accessibility, performance, forms and RSVP, copy and guest journeys, design-system consistency) after a sceptical review that removed duplicates and corrected inflated severities. Everything below was checked against the real css/styles.css and index.html; line numbers refer to those files as they stand today.

Decided facts that are **not** reported as problems: plain HTML/CSS/JS with zero third-party requests and system fonts; Netlify hosting and Netlify Forms with a strict CSP; the three-language sibling-element mechanism and the English-only no-JS page; the intentionally empty gallery; the low-resolution hero crop the owner will replace; the name order "Lingling & Max"; and every fact marked PLACEHOLDER in the markup.

Companion document: **DESIGN_SYSTEM.md** documents the proposed token set in full, with every changed value marked "(was …)".

---

## 1. Executive summary

The site is well built and the owner's instinct is right: it is yellow. Every surface token in css/styles.css is a warm cream at the same hue — page `#fbf8f1`, alternate bands `#f4efe3`, a "white" that is `#fffdf8`, a `--gold-wash`, and a `--gold-pale` hairline drawn around eighteen components — so the paper, the cards, the fields and the borders all push in the same direction and nothing on the page is actually white. The ink, by contrast, is disciplined: deep green headings at 10–12:1, body text at 8–9:1, a brand gold for small capitals that passes AA everywhere, and a single serif family carried through header, hero, footer, thanks page, favicon and social card. That is why the fix is cheap: the identity lives in the green ink, the gold ornament and the Baskerville, not in the ivory paper, so the paper can go white without the site losing itself.

Beneath the colour question the site is technically strong: 197 KB first view over eight same-origin requests, deferred scripts, a fixed-height hero band that cannot shift layout, real landmarks and heading order, labelled forms with fieldset/legend, an APG-correct tab pattern, native `<dialog>`, reduced-motion handling, and a page that reads completely without JavaScript. The weaknesses that remain are specific and fixable. A handful of WCAG colour failures sit in exactly the places guests act: secondary text drops to 4.1–4.3:1 on the tinted bands, form fields are bounded by a 1.4:1 border on a 1.04:1 fill, the focus state on inputs is 2.8:1 with the outline removed, and placeholders are 2.5:1. Chinese readers get faux-italic Songti in sixteen rules and labels at 10–11 px, which looks like a rendering bug to the audience Lingling's family represents. The label system has sprawled to seven sizes and eight trackings between 10.2 and 12.8 px, several controls older guests must tap are 28–29 px tall, the RSVP link is off-screen in the phone nav by default, and the 1 MB social-preview PNG will not render as a thumbnail in WhatsApp or WeChat. On content, the one line the couple speak in is a placeholder, there is no RSVP deadline anywhere (not even marked as one), the olive-tree form navigates gift-givers away from the only copy of the IBAN, and declining guests read "we cannot wait to celebrate with you".

None of this is a broken flow, which is why no finding below is rated critical. The recommended direction, "white and pristine", is a token change plus a short list of CSS corrections, not a redesign: pure white paper, a whisper-green band tint instead of ivory, neutral hairlines, gold reserved for the ampersand, the ornament, the dots and active states, slightly darker secondary ink, two label sizes instead of seven, and resting shadows removed so cards sit on hairlines. The reconciled scores average 6.3/10 today; the palette, contrast, form and Chinese-typography fixes alone would move colour harmony, accessibility and premium perception by two to three points each.

---

## 2. Current strengths

Keep all of these; the proposal is built on them.

1. **A real, portable identity.** Serif names with the italic gold ampersand, tracked gold capitals, the gold rule with a heart, gold timeline dots and the olive motif appear with the same hex values in index.html, thanks.html, images/favicon.svg and images/og-image.svg. Because the identity is carried by ink and ornament, it survives a change of paper.
2. **Disciplined type.** One serif family, an honest system stack that degrades Baskerville → Palatino → Georgia, fluid `clamp()` headings (h2 34→51 px, h3 25→34 px) over a fixed 18 px / 1.65 body, `text-wrap: balance` on headings, `tabular-nums` on every numeral, optical centring of the tracked hero lines (styles.css 275, 280), `font: inherit` on every control.
3. **Excellent primary contrast.** `--green` 9.9–11.8:1 and `--green-body` 7.8–9.4:1 on every surface; `--gold-text` 5.0–6.0:1; primary buttons 11:1; footer text 10.3:1.
4. **Structure and semantics.** header/nav/main/footer landmarks, `aria-labelledby` sections, h1 > h2 > h3 > h4 with no skipped level, label/for on every field, fieldset+legend for radio groups, `autocomplete`, honeypot hidden from AT, `aria-live="off"` on the countdown, translated `aria-label`s via `data-aria-label-*`.
5. **Progressive enhancement that is real.** No-JS: all days listed, static .ics, native Netlify POST, CSS `:has()` payment panels with a show-all fallback, language fixed to English. JS: tabs with arrow keys and hash deep-links, lightbox on native `<dialog>` with focus return, countdown, stepper, copy buttons, an EPC QR built in 9.8 KB without a dependency.
6. **Performance fundamentals.** 197 KB first view, hero.jpg discovered in HTML with `fetchpriority="high"`, fixed `--band` height so the image cannot shift layout, compositor-only entrance animation with a settle safety net, 7-day image cache, coherent security headers.
7. **Layout robustness.** No horizontal overflow at 375/390/768/1440/1920; EN, DE and ZH all fit; CJK falls back to Songti correctly; forms are comfortable (54 px inputs and chips).
8. **Charming, on-brand content ideas.** The olive-tree gift with the engraved plaque and a bottle of oil, the red-envelope path for Chinese guests, the dress code per day, shuttles promised, three airports with honest drive times, "Changed plans? Just send the form again".

## 3. Current weaknesses

Ordered by how much they cost the guest, not by effort.

1. **The paper is yellow at the token level.** Five warm surface tokens at hue 42–44° layered on each other (styles.css 10–13, 24–25), reinforced by a `--gold-pale` border on cards, inputs, chips, stepper, pay panel, tabs, dress rules, toggle and copy button, an ivory header wash with `saturate(140%)` (168–170), ivory input fills (541), a `--gold-wash` chip (123) and three different `theme-color`/SVG backgrounds. Cards differ from the page by 1.04:1, so nothing lifts.
2. **Secondary ink fails AA on the tinted bands.** `--green-muted #6b7461` is 4.26:1 on `--ivory-deep`, 4.08:1 on `--sage-pale`, 4.34:1 on the hero mid-tone: unselected tab labels, day meta, dress code, timeline notes, the Hotels/Gifts/RSVP leads and the hero place line (17, 338–339, 237).
3. **Form fields are nearly invisible and their focus is weak.** 1.38:1 border, 1.04:1 fill (539–543); `outline: none` with a 2.8:1 border and a 1.2:1 glow on focus (544); placeholders at 2.5:1 (545); the stepper select glow 1.4:1 (500).
4. **Chinese is set badly.** Sixteen `font-style: italic` rules slant Songti (no italic face exists), `.28–.3em` tracking is applied to CJK, labels fall to 10.2–10.9 px, and `lang="zh"` lacks the script subtag.
5. **Seven label sizes, eight trackings, several below 11 px** (100, 192, 209, 294, 354, 373, 388, 432, 502, 512, 514, 537, 569). The hero alone stacks four tracked-caps registers in two colours.
6. **Tap targets under 44 px** on the controls older guests use most: language toggle 41×29, copy buttons 56×28, stepper buttons 28 px wide (the select's intrinsic width wins), hotel card links 30 px, footer link 21 px.
7. **Phone navigation hides RSVP.** At 375 px the strip is 685 px wide (805 DE); only three labels show, RSVP is off-screen, and after scrolling back to the top the strip stays scrolled (main.js `setCurrent` never resets `scrollLeft`). The sticky header is 95 px, 11.7 % of the viewport.
8. **Thin sections read as unfinished.** Welcome is one placeholder sentence in a 333 px band; Gallery is one line in 285–445 px plus a nav slot; the hero on desktop is 1498 px tall with 190–370 px of photo in the first screen.
9. **Post-submission experience.** One thanks page for both forms, written for an accepted RSVP; the tree reservation leaves the IBAN/QR behind with no confirmation; main.js overwrites the thanks page title; no submit state, so double taps create duplicates.
10. **Content gaps not yet tracked as placeholders.** RSVP deadline, who is invited on Friday, church transport, Sunday/departure, second contact channel, visa letter for non-Schengen guests, the olive-farm story, plaque length, payment timing.
11. **Social preview is 1.01 MB RGBA PNG** (images/og-image.png) — above the roughly 300 KB limit at which WhatsApp and WeChat stop showing a thumbnail.
12. **Small CSS defects** with real dates attached: `[hidden]` is defeated by `.countdown { display: flex }` so the countdown will not hide on 10 July 2027; `.day + .day { margin-top: 4rem }` fires with JS and drops the default Saturday panel 64 px; the timeline dot halo is hard-coded to `--ivory-deep` (381).
13. **System by hand, not by token.** No spacing scale (20 gap values), no hairline token, the card shell written four times with two shadow tokens, nine hand-mixed alphas, four dead tokens, header height hard-coded in four places, six breakpoints.
14. **Copy voice is thin.** The English gift copy is colder than the German ("Your arrival is our greatest gift already", "tree(s)"), the site opens and closes on labels rather than the couple, and "the terrace on top of the Alps" contradicts "a few minutes from the town centre".

---

## 4. Design scores (0–10)

Reconciled from the auditors after the sceptic's review. 9+ is reserved for genuinely excellent work; nothing here reaches it yet. Mean: **6.3**.

| # | Dimension | Score | One-line justification |
|---|---|---|---|
| 1 | Overall premium perception | **6.5** | Coherent, restrained invitation language, but every surface is cream so cards barely lift (1.04:1), an upscaled hero and an empty gallery read "template" rather than editorial. |
| 2 | Brand identity | **7** | Strong signature (gold ampersand, tracked capitals, heart rule, dots, olives) applied identically across page, thanks page, favicon and social card; loses points because the ampersand glyph fails 3:1, the plaque illustration uses a brassier gold family, and the identity currently leans on the ivory wash the owner wants to leave. |
| 3 | Typography | **6.5** | Sound serif foundation, good fluid scale, tabular numerals and balance; held back by seven label sizes down to 10.2 px, faux-italic CJK, long tracked-caps form labels, three h3 sizes and a 39-character measure in the gifts column. |
| 4 | Colour harmony | **5.5** | Ink is disciplined, but five warm paper tokens stacked on each other are the yellow cast; `--green-muted` and the placeholder fail AA on the tinted bands, the ampersand is 2.65:1, and `--gold-pale` is a border on eighteen components. |
| 5 | Visual hierarchy | **6.5** | Section grammar (eyebrow → h2 → ornament → lead) is consistent and clear; the caps register has no rank order, the hero stacks four caps lines, h3 is three sizes, and the ivory/ivory-deep/card stack is too close in luminance to structure the page. |
| 6 | Whitespace and composition | **6** | Section padding and measures are generous and comfortable, but thin sections turn padding into emptiness (Welcome, Gallery) and the desktop hero becomes two stacked blocks of 1498 px. |
| 7 | Photography | **4** | A single 728×666 placeholder upscaled 2–2.6× on desktop and cropped to roughly the middle half; scored on what is on the page today, with the replacement already planned. |
| 8 | Emotional storytelling | **5** | The visual story is elegant, but the only couple-voiced text is a placeholder sentence; why Kitzbühel, why olives and the two-family, three-language nature of the day are never told, and the page closes on a privacy notice. |
| 9 | Navigation | **6.5** | Desktop header, active-section underline and keyboard tabs are clean; on phones the strip hides RSVP, never resets, and sits in a 95 px header with 11.8 px labels; Gallery occupies a slot while empty. |
| 10 | Mobile experience | **7** | No overflow at any width, comfortable forms, correct stacking of bank panel and QR; deductions for the tall header, small toggle/copy/stepper targets, unbalanced hero CTAs (99 vs 245 px) and orphaned words in the place line and footer date. |
| 11 | RSVP usability | **6.5** | Short, well-labelled, works without JS; but the guest count preselects 2 even for declines, there is no submit state, a shared thanks page misfires for decliners and gift-givers, fields never show an invalid state, and the deadline is absent. |
| 12 | Accessibility | **7** | Semantics, landmarks, tab pattern, dialog, reduced motion and no-JS path are exemplary; the remaining failures are mechanical colour/focus issues (muted text, field boundaries, focus ring, placeholder, ampersand) plus a focusable panel with its ring removed and silent stepper/copy status changes. |
| 13 | Performance | **8** | 197 KB, zero third parties, deferred scripts, LCP image discovered in HTML, CLS engineered out of the hero; the only real deliverable defect is the 1 MB social PNG, and the hero delivery spec is pending the original photo. |
| 14 | Technical consistency | **6.5** | Clean BEM, a real token layer with contrast notes, CSP-clean JS with null guards; but the system stops at colour (no spacing/caps/hairline tokens, four card shells, dead tokens, hard-coded header height) and a few small CSS bugs ([hidden], `.day + .day`, dot halo). |

---

## 5. Guest-journey findings per persona

### Persona A — the long-haul guest (Lingling's family and friends from China; friends flying in from abroad)

- **Lands in English.** head.js only restores a saved choice; there is no first-visit default from `navigator.languages`. The 中文 pill is 41×29 px at 11.5 px. *Medium.* Recommendation: in js/head.js, when nothing is saved, derive `data-lang` from `navigator.languages` (de → de, zh → zh, else en); enlarge the toggle to 44 px.
- **Chinese reads as a rendering bug.** Slanted Songti in the hero place line, dress code, timeline notes, hints, footer; 10–11 px CJK labels; `.3em` tracking on the date. *High.* See improvement H5.
- **The practical questions are unanswered.** When to arrive and leave, how to get from hotel to church on Saturday morning (church is a placeholder), whether an invitation letter for a Schengen visa is available, which airport has long-haul connections. These are owner facts, not page defects — listed in section 10.
- **The red-envelope path is hidden** inside the cash payment panel (index.html 437, shown only after choosing the "Cash" radio). *Optional.* Surface one sentence in the olive intro.
- **Share card is English only.** `og:locale:alternate` lists only de_DE; descriptions exist in English only. *Optional.* Add `zh_CN` alternate and consider a bilingual description.
- **In-app browsers.** Guests will open the link inside WeChat's in-app browser, where `:has()`, container queries, `svh` and `<dialog>` degrade by design (all three payment panels show, hero collapses to content height) and the Clipboard API may be absent (copy buttons silently do nothing, main.js 455). *Medium.* Add a selection fallback for copy and verify the degraded render once on a real device.

### Persona B — the older relative on a phone (a German grandparent; a Chinese aunt reading 中文)

- **Everything she must read to act is small.** Nav 11.8 px, form labels 12.5 px tracked caps, bank labels 10.6 px, copy buttons 10.2 px, countdown labels 10.2 px. Informational paragraphs (venue, hotels, timeline notes, hints) are italic in muted green at 4.1–4.6:1. *High (contrast) / Medium (size).* See H3, M1.
- **The controls she taps are small.** Toggle 41×29, copy 56×28, stepper 28 px wide, map button 38 px tall, footer mail link 21 px. *Medium.* See M2.
- **The header takes 12 % of her screen** and the nav row scrolls sideways with only a fade as the hint. *Medium.* See M3.
- **Form labels shout.** "ANZAHL GÄSTE, EUCH EINGESCHLOSSEN" in tracked capitals wraps and removes the word shapes that make German compounds readable. *Medium.* See M1 (sentence-case labels).
- **Validation speaks the browser's language**, not the site's, and vanishes; nothing marks the invalid field. *Medium.* See H4.
- **Email is required** for the RSVP; she may not use one. Owner decision (section 10).
- **Her focus is invisible in the form** if she tabs with a keyboard on a tablet. *Medium.* See H4.

### Persona C — the busy friend (wants to RSVP in sixty seconds from the hero)

- **The hero works.** Names, date, place and a 48 px RSVP button in the first screen at 375 px. The outlined calendar button is 245 px wide beside a 99 px primary, which looks odd. *Medium.* See M4.
- **The nav does not help.** RSVP is off-screen in the strip; from anywhere mid-page she must scroll 7 900 px, past a 2 067 px gifts block, to reach the form. *Medium.* See M3 and the section-order decision in section 10.
- **The form traps the single guest.** "Number of guests" preselects 2 and is submitted even with "Sadly not"; there is no field for the other names. *High.* See H7.
- **No feedback after the tap**; a slow connection invites a double submit. *Medium.* See M9.
- **A decliner reads "we cannot wait to celebrate with you"** on thanks.html, whose button goes to `/` and whose title main.js overwrites. *High.* See H7.
- **There is no deadline** and nothing on the page says there will be. *High.* See H7.

### Persona D — the gift-giver (reserving an olive tree)

- **The longest copy on the page gets the narrowest column:** about 39 characters per line inside `.container--narrow` → `.olive` 2fr/3fr (styles.css 33, 489; index.html 359), and the pay panel's `@container (min-width: 34rem)` can never fire on desktop. *Medium.* See M8.
- **Pay or reserve first?** The panel sits between the method choice and the "Reserve" button; the QR is drawn before a name is typed, so the reference lacks the name. *Medium.* See M9.
- **Reserving navigates away from the IBAN** to a thanks page written for RSVPs, with no confirmation email possible. *High.* See H7.
- **"TOTAL €140 €140 per tree"** with one tree selected; without JS the total and amount never change. *Optional / Medium.* See M9, O13.
- **QR is a non-integer downscale** (228 px canvas into 164 CSS px, `image-rendering: pixelated`). *Optional.* See O10.
- **Plaque name has no length guidance** although it is engraved. Owner decision.

### Persona E — Lingling & Max as editors (the next year of maintenance)

- The brief "make it whiter" cannot be executed in one place today: about fifteen ivory/sky/gold-alpha literals sit outside `:root` (168, 171, 237, 251, 327, 328, 459, 462, 500, 517, 544, 545, 565, 571), `theme-color` differs between the two pages (`#fbf7f1` vs `#fbf8f1`), and favicon.svg and og-image.svg bake in the ivory. *High (as part of H1).*
- Replacing hero.jpg and og-image.png "under the same name" (README) meets a 7-day image cache; returning guests keep the blurry hero for a week. *Medium.* See M16.
- Stale comments (EN/DE only, Europe/Berlin), four unused tokens, three unused classes. *Optional.* See O7, O9.
- After 10 July 2027 the countdown freezes beside "We are married!" ([hidden] defeated), both forms stay open, the hotel block text expires. *Medium.* See M5 and section 10.
- Netlify Forms free allowance (100/month across both forms) will be hit in the RSVP burst with more than ~80 households. *Medium, not code.* Verify in the dashboard before the link goes out.

---

## 6. Proposed creative direction — "white and pristine"

The owner's words: "too yellowish; it needs to be more white and a pristine wedding look." Translated into a direction that keeps what works: **white paper, green ink, a little gold, a lot of air.** Editorial rather than stationery. The invitation card is the source of the motifs, not of the paper colour.

### 6.1 Palette (all ratios computed with the WCAG 2.x formula)

| Token | Proposed | Role | Contrast |
|---|---|---|---|
| `--paper` | `#ffffff` (was `--ivory #fbf8f1` page / `--white #fffdf8` cards) | page, cards, inputs, header, stepper | — |
| `--paper-tint` | `#f4f6f1` (was `--ivory-deep #f4efe3`) | alternate bands: Schedule, Hotels, Gifts; `.code` chip; `.pay` panel; checked chip | 1.09:1 against white (a visible band, cool not yellow) |
| `--paper-accent` | `#e9ecdf` (= `--sage-pale`, unchanged) | RSVP band only — the one coloured section, marking the call to action | 1.20:1 against white |
| `--sky-pale` / `--sky` | `#f3f6f7` / `#d6e3ec` (was raw `#eef2f3` and `#d6e3ec`; `--sky #dbe7f0` unused) | hero gradient `#fff 0% → #f3f6f7 45% → #d6e3ec 100%` and the haze; og-image background | — |
| `--green` | `#2f3b27` (unchanged) | headings, nav, primary button, footer background | 11.83:1 on white, 10.87 on tint, 9.87 on accent |
| `--green-deep` | `#243020` (was a raw literal) | primary button hover | 13.83:1 |
| `--green-body` | `#3f4a36` (unchanged) | body text | 9.36 / 8.60 / 7.81 |
| `--green-muted` | `#5f6856` (was `#6b7461`) | secondary text, leads, notes, placeholders | 5.83 white / 5.36 tint / 4.87 accent / 5.37 sky-pale — AA everywhere |
| `--gold` | `#a17f2c` (was `#b8963e`) | ampersand, ornament rule and heart, timeline line and dots, active underlines, ghost-button border, checked-chip border | 3.76 white / 3.45 tint / 3.14 accent (≥3:1 for large text and UI); 3.15 on the green footer |
| `--gold-text` | `#7a5f18` (unchanged) | small capitals, eyebrows, focus ring, selected tab | 6.04 / 5.55 / 5.04 |
| `--gold-pale` | `#e6d9b4` (unchanged value, role reduced) | footer links only | 8.42:1 on green |
| `--line` | `#e3e6de` (new; replaces `--gold-pale` as a border) | hairlines: cards, tabs rule, dress rules, chips, toggle, copy button, card-link divider, header bottom | decorative, 1.26:1 |
| `--line-strong` | `#8f978a` (new) | text-field, select and stepper borders | 3.02:1 on white (WCAG 1.4.11) |
| footer text | `#e9ece4` (was `--ivory-deep`), names `#fff`, small print `rgb(255 255 255 / .7)` | footer | 9.90 / 11.83 / 6.71 on green |
| removed | `--ivory`, `--ivory-deep`, `--parchment`, `--white`, `--gold-wash`, `--sky` (old value) | — | — |

Why these numbers and not others: three auditors proposed three muted greens (`#606a57`, `#5f6856`, `#636c59`) and four band tints. `#5f6856` is the only muted value that clears 4.5:1 on the RSVP accent band with margin; `#f4f6f1` is the lightest tint that still reads as a band next to white cards (today's ivory-deep/ivory step is 1.08:1 and reads as nothing). The gold at `#a17f2c` is the lightest that passes 3:1 on all three paper surfaces, so one gold can serve glyph and ornament without a second "ink gold" token.

### 6.2 Typography (system fonts only)

- **Family stays Baskerville-first**: `Baskerville, "Palatino Linotype", "Book Antiqua", Palatino, Garamond, Georgia, "Times New Roman", serif` — Palatino is moved ahead of Garamond so Windows gets the sturdier face; `"Cormorant Garamond"` and `"EB Garamond"` are dropped because they are not system fonts and shrink the x-height for the few who have them installed (optional, owner may keep). Chinese: Latin faces first, then `"Songti SC", "Songti TC", "Noto Serif CJK SC", "Noto Serif SC", "Source Han Serif SC", SimSun, serif`.
- **Two label sizes instead of seven**: `--caps-m` .8rem / .2em (nav, buttons, toggle, footer date) and `--caps-s` .75rem / .16em (countdown labels, copy, bank labels, tab dates, dress label, card meta, total label, timeline place). The signature `.eyebrow` keeps .8rem / .28em. Nothing below 12 px.
- **Form labels in sentence case** at 1rem, `--green`, `.01em` tracking (decision pending, section 10). Tracked caps stay for tags, not instructions.
- **Chinese**: upright everywhere (`html[data-lang="zh"] [lang="zh"] { font-style: normal }`), tracking capped at .15em on display lines and .08–.1em on labels, label floor .8rem, headings `line-height: 1.25`, `lang="zh-Hans"`.
- **Secondary voice**: italic + `--green-muted` for EN/DE asides only, via one `.note` utility rather than ten rules; informational paragraphs in cards (venue, hotels) go upright in `--green-body`.
- **Heading scale** unchanged for h1/h2/h4; h3 collapses from three sizes to two (`--h3-display` for day and venue titles, `--h3` for cards and olive title).
- Optional, to test on white: remove `-webkit-font-smoothing: antialiased` from body (62) so Baskerville's hairlines are not thinned on macOS; keep it on the dark footer.

### 6.3 Spacing, layout, composition

- A six-step spacing scale (`--s1` .25rem … `--s6` 2.5rem) plus the three clamps already in spirit (`--section-pad`, `--head-gap`, `--card-pad`). 20 gap values become 8.
- Three widths for content: `--measure` 42rem (leads, thanks card, tab list), `--narrow` 48rem (schedule, RSVP), `--wide` 60rem (gifts, so the olive copy reaches ~60 characters per line and the QR can sit beside the IBAN), `--container` 72rem.
- Three breakpoints (40 / 50 / 60em) and one `--header-h` token instead of six breakpoints and four hard-coded header heights.
- **Hero**: keep the band and the sky, start the gradient from pure white, tighten top padding and the countdown below 48em so the photo edge lands around 65–70 svh, give both CTAs equal width on phones, reduce the olive sprigs (width clamp 7–11rem, opacity .6) or redraw them in the thin-stroke style of the timeline icons.
- **Sections on white**: alternate `--paper` / `--paper-tint`, RSVP on `--paper-accent`, footer green. Cards are white on a hairline, no resting shadow; the one shadow left is for hover (gallery tiles) and the scrolled header.
- **Timeline**: keep the gold dot-and-line (the card's motif); remove the per-event clip-art icons on desktop, or move them beside the title (decision, section 10).
- **Ornament**: keep it, but decide whether it appears after every h2 or is rationed to hero, gifts and footer; unify the order (heading → ornament) if it stays everywhere.
- **Thin sections**: hide Gallery and its nav item until photos exist; give the Welcome 3–5 lines in the couple's voice or fold its sentence into the hero.

### 6.4 What to remove, what to keep

Remove: every cream surface token; `--gold-pale` as a border; `saturate(140%)` on the header; resting card shadows and the heavier `--shadow` on `.form`; the 1 px hover lift on buttons; faux-italic CJK; the seconds unit of the countdown (optional); the per-event timeline icons (recommended); the empty Gallery from the nav; `Cormorant`/`EB Garamond` from the stack.

Keep: the serif, the green ink, the gold ampersand and ornament, the timeline dots, the olive-tree illustration (re-tinted toward the brand gold), the section grammar, the generous section padding, the hero band composition, the three-language mechanism, every behaviour that works without JS.

---

## 7. Prioritised improvement list

No item is rated critical: after the sceptic's review nothing on the site is a broken flow. "High" means a guest-facing defect or an AA failure; "medium" a visible polish or maintainability issue with user impact; "optional" taste, housekeeping or future-proofing.

### High

| ID | Change | Where | Expected benefit |
|---|---|---|---|
| H1 | **Rebase surfaces on white.** Replace the paper tokens with `--paper #fff`, `--paper-tint #f4f6f1`, keep `--sage-pale` for RSVP; header `rgb(255 255 255 / .86)` with `blur(12px)` only; hero gradient from `#fff`; inputs, stepper, chips, `.code`, `.pay`, `.btn--ghost`, `.lang-toggle` re-pointed; `theme-color #ffffff` on both pages; background rects in images/favicon.svg and images/og-image.svg; re-export og-image. | styles.css 10–13, 24–25, 57, 123, 159, 168–170, 188, 196, 237, 251, 326, 328–330, 338, 441, 495, 498, 506, 541, 544, 552, 556, 564, 568, 571; index.html 9; thanks.html 10; images/favicon.svg, og-image.svg | Removes the yellow cast at its root in one commit; cards and fields separate from the page; gold reads as an accent again. |
| H2 | **Introduce `--line` and stop using `--gold-pale` as a border.** Eighteen borders → `var(--line)`; header hairline → `--line` (or a deliberate 25 % gold); `::selection` → `--sage-pale`. | styles.css 88, 124, 171, 188, 344, 370, 405, 427, 435, 442, 481, 493, 495, 499, 506, 514, 531, 541, 552 | Gold appears only where it means something; the largest single contributor to the wash disappears. |
| H3 | **Fix the three failing inks.** `--green-muted #5f6856`; `--gold #a17f2c` (ampersand ≥3:1 everywhere); `::placeholder { color: var(--green-muted) }` (keep italic for EN/DE); update the contrast comments. | styles.css 17, 22, 90, 545 | WCAG 1.4.3 passes on every surface for leads, tabs, notes, placeholders and the brand glyph; the slightly darker tones also read crisper on white. |
| H4 | **Make fields visible and focus compliant.** `.form__input`, `.stepper`, `.stepper__select`: border `1px solid var(--line-strong)`; remove `outline: none` and the glow; `:focus-visible { outline: 2px solid var(--gold-text); outline-offset: 0 }`; delete the inset glow on the select; add `:user-invalid { border-color: var(--gold-text); border-width: 2px }` plus a short trilingual message line per required field. Keep native validation. | styles.css 495, 499–500, 539–545 | WCAG 1.4.11 and 2.4.7 pass; low-vision guests see where fields begin; keyboard users keep track of focus in the two forms that matter most. |
| H5 | **Set Chinese properly.** `html[data-lang="zh"] [lang="zh"], html[data-lang="zh"] .form__input::placeholder { font-style: normal }`; cap tracking (`.hero__date`, `.hero__headline`, `.eyebrow` → .15em; labels → .08–.1em); label floor .8rem; headings `line-height: 1.25`; tag Simplified as `zh-Hans` in markup, js/head.js and js/main.js (`root.lang`), and switch the CSS language selectors to `[lang|="zh"]`; add `"Noto Serif SC"` to the stack. | styles.css 146–151 (+ new block); index.html every `lang="zh"`; js/head.js 7–9; js/main.js 53, 113–117 | Chinese readers get upright, legible Songti at ≥12.8 px; screen readers and fonts pick the Simplified voice and glyph forms. |
| H6 | **Replace the social-preview PNG with a JPEG under 300 KB.** `sips -s format jpeg -s formatOptions 85 images/og-image.svg --out images/og-image.jpg` (≈190 KB; a standard encoder at q80 ≈ 112 KB); point `og:image`/`twitter:image` at it; add `og:image:type image/jpeg`; fix the README recipe; export after H1 so the card is white too. | images/og-image.png; index.html 18, 27; README "Social preview" | The link guests will share most shows a picture in WhatsApp and WeChat. |
| H7 | **RSVP and post-submit content.** (a) Add a PLACEHOLDER comment and a "Please reply by …" line in the RSVP lead and `.form__hint`, and add the deadline to the README checklist. (b) `#rsvp-guests`: `<option value="" disabled selected>Please choose</option>` + `required`; add an optional "Names of everyone coming" field; hide guests/names/dietary when "Sadly not" is checked with the same `:has()` pattern used for payment panels. (c) Make thanks.html neutral for decliners and point its button to `/#rsvp`; give the tree form its own `thanks-trees.html` that repeats the payment details compactly and links to `/#gifts`. (d) In main.js only override `document.title` when the page opts in. | index.html 456–458, 486–494, 509, 381, 461; thanks.html 29–32; js/main.js 48–52, 117; README 40–49 | Reliable headcount data, no phantom plus-ones, no "cannot wait to celebrate" for decliners, gift-givers keep the IBAN in front of them, the deadline is tracked with the other placeholders. |

### Medium

| ID | Change | Where | Expected benefit |
|---|---|---|---|
| M1 | **Consolidate the label system.** Two caps tokens (`--caps-m` .8rem/.2em, `--caps-s` .75rem/.16em) and one `.caps` utility; map the fourteen rules to them; `.form__label` to 1rem sentence case; fold the optical `padding-left` compensation into the centred label style. | styles.css 99–106, 192, 209, 275, 280, 294, 320, 354, 373, 388, 432, 502, 512, 514, 537–538, 569 | Readable for older guests, a rank order the eye can follow, one place to tune the signature caps, a single hook for the zh override. |
| M2 | **44 px targets on the controls guests tap.** `.lang-toggle__btn { padding: .55rem .85rem; font-size: var(--caps-m) }`; `.copy { min-height: 2.25rem; padding: .45rem .8rem }` and `@media (pointer: coarse) { .copy, .lang-toggle__btn { min-height: 2.75rem } }`; `.stepper__btn { flex: none; width: 2.75rem }` + `.stepper__select { min-width: 0 }`; `padding-block: .5rem` on `.card__links a` and the footer link. | styles.css 190–195, 435, 496, 498, 514, 565 | Fewer mis-taps on the toggle, copy and stepper; no 28 px stepper buttons. |
| M3 | **Phone header and nav.** Move RSVP out of the strip into the top row as a small outlined button beside the toggle (new grid column); shorten labels ("Travel", "Anreise", "交通"); hide the Gallery `<li>` while empty; nav font `--caps-m`; in `setCurrent`, call `navEl.scrollTo({ left: 0 })` when `id` is null; single-row header from 60em with `--header-h` driving `scroll-padding-top`, hero and `.page` offsets; centre the nav row on tablets. | styles.css 46–50, 176–180, 199–228, 236, 240, 574; index.html 57–67, 51–55; js/main.js 505–518 | RSVP reachable from every screen; header drops from 95 px toward 60 px; strip no longer stays scrolled mid-way; DE no longer masks "Rückmeldung" at 1280 px. |
| M4 | **Hero and wrapping on phones.** `.hero__actions .btn { flex: 1 1 12rem; max-width: 20rem }`; split `.hero__place` into a time part and a place part with `white-space: nowrap` spans for "Kitzbühel, Austria / Österreich / 奥地利基茨比厄尔" and `text-wrap: balance`; same for `.site-footer__date`; end the Hotels sentence before the `.code` chip or wrap chip + period together; tighten hero top padding and countdown size below 48em. | styles.css 261, 282, 286, 290, 300, 569; index.html 85, 310–312, 520 | Balanced CTAs, no lone "Austria"/"尔"/stranded "·", the photo edge higher on the first screen. |
| M5 | **Fix the small CSS defects.** Add `[hidden] { display: none !important }` to the reset; scope `.no-js .day + .day { margin-top: 4rem }`; `.timeline__item::before { box-shadow: 0 0 0 4px var(--section-bg) }` with `--section-bg` set per section; `.countdown__value { min-width: 2ch }`, `[data-unit="days"] { min-width: 3ch }`. | styles.css 41 (reset block), 288, 359, 381 | Countdown hides on the wedding day; no 64 px jump when switching tabs; the dot halo survives the palette change; no post-paint widening of the countdown. |
| M6 | **Accessibility mechanics.** Delete `.day:focus-visible { outline: none }` and the `panels[i].tabIndex = 0` line; `role="status"` on `.olive-form__total` and a visually-hidden status span for "Copied"; translated `aria-label` for the nav, tabs list and brand (`data-aria-label-de/zh`) and `alt` added to `ATTRS` for the olive-tree image; `aria-current="location"`; `.site-footer :focus-visible { outline-color: var(--gold-pale) }`; selected tab `border-bottom: 2px solid var(--gold-text)`; skip link to `#main`. | styles.css 87, 355, 360, 564; js/main.js 93, 282, 510; index.html 45, 49, 57, 128, 370, 396, 421, 424 | Focus never disappears; stepper and copy changes are announced; German and Chinese screen-reader users hear translated names. |
| M7 | **One card shell.** A single `.card` base (`--paper`, `1px solid var(--line)`, `--radius`, `--card-pad`, no shadow) composed by `.venue__card`, `.olive`, `.form`, hotel `.card`; `--shadow-soft` reserved for hover and the scrolled header; drop the heavy `--shadow` from `.form`. | styles.css 35–36, 404–407, 426–430, 479–483, 530–533 | Cards look like one family; hairline-on-white is the pristine look the owner asked for; one padding recipe. |
| M8 | **Give the gifts section room.** `#gifts` in a `--wide` 60rem container; `.olive` grid `minmax(0, 18rem) minmax(0, 1fr)` at ≥50em; lower the pay-panel query to `@container (min-width: 30rem)`; verify at 768 and 1440. | index.html 359; styles.css 33, 488–491, 509 | Olive copy at ~60 characters per line; QR beside the IBAN on desktop as the container query intends. |
| M9 | **Olive-tree flow and submit feedback.** Three-line "How it works" above the payment choice (numbers and deadline from the owner); hide the reference row and QR until a name is typed with `.olive-form:has(#tree-name:placeholder-shown) …` and a one-line prompt; "please write your name on the envelope" in the cash note; a CSP-safe submit listener that sets `aria-busy`, disables the button and swaps its label ("Sending… / Wird gesendet… / 发送中…") while keeping the native POST; `js-only` on the live totals with a no-JS "€140 per tree" fallback; a Clipboard fallback (select the text) and a `.catch`. | index.html 396, 408–443, 423; js/main.js 390–466 | Guests know whether to pay before or after reserving; transfers carry the name; no duplicate submissions; the no-JS page stops showing a wrong total. |
| M10 | **Copy corrections in the couple's voice.** Rewrite EN gift copy to the warmth of the DE ("Having you with us is already the greatest gift"; "plant an olive tree with us"; "Your name goes on a small engraved plaque on your tree"); button "Plant my tree"/"Reserve trees"; replace "For the next lucky girl!"; one consistent venue description instead of "the terrace on top of the Alps"; change the Saturday place link label so it does not promise the church while opening the hotel. | index.html 168, 199, 207–209, 363, 374, 377, 441–442 | English matches the German's tone; no self-contradiction; no mislabelled link. |
| M11 | **Illustration tints.** olive.svg olives `#9aa84a`/`#d9df9a` → `#4f5b2e` and `--sage`; olive-tree.svg plaque family `#e0c26a/#e6cc7a/#c9a648/#fff3c4` → flat `--gold #a17f2c` with a `--gold-text` edge; og-image.svg sky → `--sky`. | images/olive.svg 15–16; images/olive-tree.svg defs; images/og-image.svg | The two most saturated objects on the page stop carrying the warm cast once the paper is white. |
| M12 | **Welcome section.** Keep the placeholder status; brief the owner for 3–5 first-person sentences (greeting to both families, why Kitzbühel, the shape of the weekend, three things to do, a signature) or fold the single sentence into the hero and remove the section; halve padding for head-only sections. | index.html 107–116; styles.css 335 | The site speaks in the couple's voice once; no 333 px band for one line. |
| M13 | **First-visit language default** from `navigator.languages` in js/head.js (explicit clicks still persist). | js/head.js 5–11 | German and Chinese relatives land in their language. |
| M14 | **Cache versus same-name replacement.** When the original photo and the new social card arrive, change the filenames (`hero-2027.jpg`, `og-image-2027.jpg`) or append `?v=2`, or soften `/images/*` to `max-age=86400, stale-while-revalidate=604800`. | netlify.toml; README; index.html 18, 27, 76 | Returning guests see the new hero immediately instead of after a week. |
| M15 | **Verify Netlify Forms quota** before the link goes out; note the decision in README. | README "Forms" | No silent stop of RSVPs in the first week. |

### Optional

| ID | Change | Where | Expected benefit |
|---|---|---|---|
| O1 | Hide the Gallery section and nav item (`hidden` attribute, `[hidden]` reset from M5) until photos exist; markup and lightbox stay. | index.html 63, 344–355 | No unfinished chapter; one less nav slot on phones. |
| O2 | Hero sprigs: `width: clamp(7rem, 11vw, 11rem); opacity: .6` or redraw olive.svg in the thin-stroke style of the icons. | styles.css 254–257; images/olive.svg | Hero reads editorial rather than clip-art. |
| O3 | Hero export brief for the original: 800/1400/2000 px AVIF + JPEG via `<picture>`/`srcset`, church in the right third, consider `--band` max 44rem on desktop. | index.html 76; styles.css 233 | Sharp hero at every width; hero text and photo in one 900 px screen. |
| O4 | Countdown: drop seconds, tick once a minute; under reduced motion hide the seconds unit. | index.html 91; js/main.js 154–176 | Calmer hero; the contested 2.2.2 reading disappears. |
| O5 | Heart ornament as one `<symbol>` referenced by `<use>`; unify heading → ornament order (hero included); decide whether to ration it. | index.html 81, 110, 124, 262, 308, 348, 362, 455, 518; thanks.html 32; styles.css 141, 567 | One definition, one grammar, less wallpaper. |
| O6 | Breakpoints 40/50/60em and a `--header-h` token; delete the dead 60–65.99em rule; fix thanks.html's desktop offset. | styles.css 46–50, 217–228, 236–241, 257, 392, 419, 436, 448, 471, 488, 574 | One place to change the header height; no 32 px-apart breakpoints. |
| O7 | Housekeeping: spacing scale, three content widths, `color-mix()`/`rgb(… / a)` for the nine alphas, delete `--parchment`, `--sky` (old), `.eyebrow--green`, `.lead--italic`, line 487 and line 567, `--radius-sm 2px` and `--radius-pill`, one `.note` utility replacing the ten italic-muted rules and the `> p[lang]` selectors, `.btn--sm`/`.btn--outline` split. | styles.css throughout | The next edit stays in system; the palette commit does not leave mismatched alphas behind. |
| O8 | Type polish: remove `Cormorant Garamond`/`EB Garamond` from the stack, put `Palatino Linotype` before `Garamond`, test body without `-webkit-font-smoothing: antialiased` on white, consider h2 floor 1.85rem / h1 floor 2.85rem on phones. | styles.css 29, 62, 77, 267 | Consistent apparent size across platforms; Baskerville not thinned on white. |
| O9 | Code hygiene: head.js before the stylesheet; `100vh` fallback before each `svh`; a `no-js`→`js` swap at the top of main.js; ICS `'\\;'` escape; comment pass (ZH, Vienna, README table); `img-src 'self'`; HSTS once the domain is final; `color-scheme: only light` to opt out of Android auto-dark. | index.html 33–35; thanks.html 14–15; styles.css 44, 236, 240, 574; js/main.js 14, 91, 183; netlify.toml | Slightly faster first paint, no edge-case collapse of the hero, no inverted palette on Android. |
| O10 | QR: compute `scale` from `devicePixelRatio` so modules land on whole device pixels (keep the 164 px box); copy the IBAN without spaces; `autocapitalize="words"` on name inputs; reduce the SEPA reference to the Latin set with a fallback. | js/main.js 408–423, 456; css 517; index.html 401, 469 | More reliable scans and matches in the payment path. |
| O11 | Small content items once decided: plaque `maxlength` + hint; dietary placeholder "Anna: vegetarian · Tom: nut allergy"; a children/plus-one sentence; the contact link repeated in the RSVP hint; "(opens in a new tab)" visually-hidden spans; a one-line data note under each form and a decision on `noindex`. | index.html 401, 499, 456–458, 509, external links, 441/508 | Fewer follow-up emails; accurate privacy claim. |
| O12 | Editorial: promote "We are getting married" or drop it in favour of the eyebrow; a sign-off line in the footer above the contact; move the privacy line to the smallest size. | index.html 83–88, 519–523 | The page opens and closes on the couple, not on labels. |
| O13 | Olive total line: render "€140 per tree" only when count > 1 (toggle `hidden` in `update()`), button label "Reserve 1 tree / 3 trees" from `update()`. | index.html 396, 441; js/main.js 434–443 | No "€140 €140". |
| O14 | Timeline icons: remove on desktop (recommended) or move beside the title; if kept, one icon grammar (24-unit, 1.6 stroke, `--sage`) shared with the travel list. | styles.css 390–399; index.html timeline items | A quieter, more editorial schedule; the dot-and-line carries the structure alone. |

---

## 8. Technical risks

1. **Palette change without a render check.** None of the five palette proposals was rendered; the real by-eye decision is how the warm meadow tones of the hero photo and the olive-tree illustration sit on `#ffffff` versus `#f4f6f1`. Mitigation: a side-by-side of the two candidate band treatments (pure white alternation vs white + green-tint) before committing, on a Mac and on a Windows or Android device.
2. **Baskerville on pure white.** High-contrast hairline serifs look thinner on white than on ivory, and grayscale antialiasing thins them further on macOS. Mitigation: test with and without `-webkit-font-smoothing: antialiased`; if the body looks spindly, `--paper` can be `#fdfdfb` with no measurable effect on any ratio above.
3. **Hard-coded literals and assets drift.** The change touches ~15 literals outside `:root`, two `theme-color` metas, two SVG backgrounds and a re-exported PNG/JPEG; miss one and the header, favicon or share card stays cream. Mitigation: the token list in DESIGN_SYSTEM.md doubles as the checklist; grep for `251, 248`, `253, 248`, `#fbf8f1`, `#fffdf8`, `#f4efe3`, `#e6d9b4` after the edit.
4. **Modern CSS used for convenience.** `color-mix()`, `rgb(r g b / a)`, `:user-invalid` and `@container` are evergreen-only (2023+). Where a value is critical (header background, focus ring) write the literal `rgba()` as well, or accept that older engines fall back to the resting style. Nothing proposed needs a polyfill, inline style or CSP change.
5. **Language-tag change.** Switching to `zh-Hans` touches the CSS hide/show selectors (146–150), js/head.js and js/main.js; a missed selector would show two languages at once. Mitigation: move the selectors to `[lang|="zh"]` first, deploy, then change the markup.
6. **Header restructure.** Moving RSVP into the top row and introducing `--header-h` changes `scroll-padding-top`, the hero `min-height` and the thanks page offset together; anchors must be re-tested at 375, 768 and 1280 in all three languages (DE is the widest).
7. **Image caching.** The 7-day `/images/*` cache will serve the old hero, favicon and social card to returning guests after a same-name replacement; crawlers cache separately. Use new filenames (M14).
8. **Netlify Forms.** Form detection is unaffected as long as `name`, `data-netlify` and `form-name` stay; a second thanks page is just another static file. The quota and the `/thanks.html` redirect have never been exercised on a deploy preview; exercise both once before launch.
9. **Forced-colours and auto-dark.** In Windows High Contrast the hairline chips and gold ornaments vanish (borders survive as CanvasText, so cards and fields remain delimited); on Android, `color-scheme: light` does not opt out of Chrome's auto-dark — `only light` does. Both are one-line additions (O9).
10. **Devices nobody has seen.** All screenshots came from macOS; Windows (Palatino/Garamond, SimSun), Android (Noto Serif) and WeChat's in-app browser were reasoned about, not rendered. The calendar button's Blob download on iOS Safari is also untested. Budget one evening on real devices after the palette lands.

## 9. Expected benefits

- **The owner's brief is met at the root**: a white, cooler, more editorial page in which the gold is scarce enough to be precious, achieved by changing tokens, not components.
- **AA compliance on colour** across every surface (muted text 4.9–5.8:1, fields 3:1 boundaries, focus 6:1, ampersand ≥3:1), which is also what makes the page look crisper.
- **Chinese guests get a page that looks designed for them**: upright Songti at legible sizes with conventional spacing and the right language tag.
- **Older guests can read and tap**: nothing below 12 px, nothing below 44 px on touch, sentence-case form labels, upright informational paragraphs.
- **Cleaner data for the couple**: a chosen guest count, names of everyone coming, a tracked deadline, no duplicate posts, decliners and gift-givers thanked appropriately, payment details kept in view.
- **A share card that shows a picture** in WhatsApp and WeChat.
- **Maintainability**: one surface scale, one hairline, two caps sizes, one card shell, a spacing scale and a header-height token mean the next request ("a little warmer", "larger labels") is again a handful of edits at the top of the stylesheet.
- **Nothing is given up**: no framework, no fonts, no third-party request, no inline style, no loss of the no-JS behaviour or of the invitation's motifs.

## 10. Areas requiring human confirmation

**Facts that are placeholders (do not invent; fill before launch).** Church name and church transport; PayPal.me link; both dress codes (plus an optional "mountain evenings cool down" line); hotel booking code, hold date and booking channel, further hotels; contact email; welcome text; the hero original; DE/ZH drafts for family review. **Not yet marked as placeholders and should be**: the RSVP deadline; whether all guests are invited on Friday and whether a Friday headcount is wanted; what happens on Sunday / when to leave; the olive-farm story (where, why, when the trees are planted, when the oil arrives, plaque material and character capacity); the payment deadline for trees; children and plus-one policy; a second contact channel (phone/WhatsApp/WeChat or a named Chinese-speaking contact); whether a visa invitation letter is offered; a preferred airport if any; what the site should show after 10 July 2027.

**Creative choices with more than one valid answer.**
1. **How much gold.** Darken `--gold` to `#a17f2c` everywhere (one gold, passes 3:1) versus keep `#b8963e` for `aria-hidden` ornaments and use the darker value only for the ampersand — or declare the h1 ampersand a logotype and leave it. Recommendation: one gold.
2. **Band treatment.** Pure white page with white cards and hairlines only, versus white alternating with the green-tint `#f4f6f1`, versus keeping the RSVP band in `--sage-pale`. Recommendation: white / tint alternation with the sage RSVP band; decide after a side-by-side render.
3. **Olive sprigs in the hero**: reduce, redraw in line style, or remove.
4. **Heart ornament**: after every h2 as today, or rationed to hero, gifts and footer; and the hero order (ornament above the names) versus the section order (below the heading).
5. **Name order**: the site shows "Lingling & Max" on purpose; the invitation card reads "Max & Lingling". Confirm the site order is final (it also appears in the brand, footer, favicon, social card, ICS and the plaque illustration).
6. **A sans-serif for UI text** (nav, buttons, form labels, bank rows) versus staying all-serif. Recommendation: stay all-serif; it is the identity, and the label consolidation solves the legibility problem.
7. **Form labels**: sentence case at 16 px (recommended) versus tracked capitals as today.
8. **Timeline icons**: remove on desktop (recommended) versus move beside the title.
9. **Card shadows**: none at rest (recommended) versus keep `--shadow-soft`.
10. **Corner radius**: keep 4 px versus 2 px site-wide for a squarer, more editorial feel.
11. **Section order**: RSVP before Gifts (etiquette) versus Gifts before RSVP as today.
12. **Schedule**: tabs with Saturday default as today, tabs with Friday default, or both days stacked.
13. **Countdown**: keep seconds versus tick per minute.
14. **Gallery**: hide the section and nav item until photos exist (recommended) versus keep the "Photos will follow" band.
15. **Hero copy**: keep "Wedding 2027" + "We are getting married" as two caps lines, or make one of them the emotional line in the italic serif.
16. **Footer**: add a sign-off above the contact; soften "no third parties" to "no cookies, no tracking"; add a one-line data note under each form; `noindex` on index.html.
17. **RSVP contact**: keep email required, make it optional, or add a phone/WeChat field.
18. **Font stack**: drop `Cormorant Garamond` and `EB Garamond` (recommended) versus keep them for guests who installed them.
19. **Language default** from the browser on first visit (recommended) versus always English.

---

## 11. After implementation (verified 27 October 2026)

The white restyle was implemented on the stylesheet, markup, scripts and assets, then re-checked by four source-based testers (accessibility, forms, performance and technical, typography and colour) and a manual browser pass at 375 and 1024 px in English, German and Chinese. The visual and copy testers of the QA run did not complete, so the composition, photography, storytelling and navigation scores below are my own verified judgement, not a tester's.

| Dimension | Before | After | Note |
|---|---|---|---|
| Overall premium perception | 6.5 | 8 | white paper, hairlines, one gold, no shadows; hero and schedule read as editorial |
| Brand identity | 7 | 7.5 | identity kept; icons, share image and plaque now use the one brand gold |
| Typography | 6.5 | 7.5 | tester score; label system consolidated, Chinese upright and larger |
| Colour harmony | 5.5 | 8 | tester score; cream removed, every text colour passes AA on its band |
| Visual hierarchy | 6.5 | 7.5 | caps in three ranks, form labels in sentence case, countdown calmer |
| Whitespace and composition | 6 | 7 | gallery compact, welcome has substance; hero still two stacked blocks on wide screens |
| Photography | 4 | 4 | unchanged until the original hero photo arrives |
| Emotional storytelling | 5 | 6 | a short welcome in the couple's voice, signed; still a placeholder to rewrite |
| Navigation | 6.5 | 7.5 | RSVP button in the header on every width, nav strip fits at 375 px in all three languages |
| Mobile experience | 7 | 8 | equal-width hero buttons, 44 px targets on touch, no overflow, QR hidden on phones |
| RSVP usability | 6.5 | 7 | tester score; decline hides and disables details, days asked, guests default 1, sending state, own thank-you page for trees |
| Accessibility | 7 | 7.5 | tester found 6.5 before the fixes; the critical and high items (language button, stepper and field focus, copy announcements, Chinese sizes) are fixed |
| Performance | 8 | 8.5 | tester score; share image 1 MB PNG → 227 KB JPEG, head script before the stylesheet, CLS guards |
| Technical consistency | 6.5 | 7.5 | tester score; tokens for paper, lines, labels, spacing, header height; dead rules removed |

**Implemented:** white paper with a green-grey tint band and a sage RSVP band; neutral hairlines instead of gold borders; one gold for ampersand, ornaments and timeline; darker muted green and placeholders; no resting shadows; two caps sizes plus eyebrows; sentence-case form labels; Chinese tagged zh-Hans, upright, 12 px floor, lighter tracking; header with an RSVP button and a text language toggle; nav strip without RSVP and Gallery, Welcome hidden on phones; hero without seconds, with a two-line place note and equal buttons; welcome text with sign-off; timeline icons as medallions on the line; RSVP before Gifts; RSVP intro line, days checkboxes, guests default 1, decline hides and disables details, hidden language field, sending state; olive-tree steps, own thank-you page, SEPA-safe reference, QR at device pixels, copy fallback and live region; `?lang=` links; share image as JPEG; `[hidden]` rule; CSP without `data:`; internal documents blocked from the public site.

**Remaining issues**
- Medium: the hero photo is still the 728 px crop (replace with the original; add `srcset` then).
- Medium: no inline error text under invalid fields, only native bubbles and a gold border.
- Medium: `.day + .day` spacing, breakpoints at 40/50/66em and the container query at 30rem are implemented but not yet tested on a real tablet.
- Optional: the thank-you pages keep an English tab title in German and Chinese; the ICS folding counts characters rather than bytes for Chinese lines; `color-scheme: only light` added but untested on Android auto-dark.

**Still for Max and Lingling to decide or confirm:** RSVP deadline; the church and the transfer from church to hotel; Sunday; dress codes; hotel code, hold date and booking channel; contact address and a day-of phone number; PayPal.me link; whether the gallery stays hidden until photos exist; the welcome text in their own words; `noindex` for the public page.

**Does it feel like a bespoke, premium European destination wedding experience?** Closer than before and honestly most of the way: the page now reads as white paper with green ink and a little gold, the schedule looks like the invitation card, and the forms feel considered. What still holds it back is content rather than design: one soft placeholder photo, a welcome that is not yet in the couple's words, and the facts still marked as placeholders. With the original photo and the couple's own paragraph it would pass as bespoke.
