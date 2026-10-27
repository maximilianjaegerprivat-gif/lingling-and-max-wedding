# Lingling & Max — Wedding 2027

The public wedding website for Lingling and Max: one page, English with German and Chinese toggles, hosted on Netlify at **https://lingling-and-max.netlify.app**. The wedding is on Saturday 10 July 2027 at the Grandhotel Kitzbühel (Malinggasse 12, 6370 Kitzbühel), with a welcome evening on Friday 9 July and a farewell breakfast on Sunday 11 July.

Plain HTML, CSS and vanilla JavaScript. No framework, no build step, no dependencies, no third-party requests (no fonts, analytics, maps, payment scripts or CDN files), so no cookie banner is needed. Everything reads correctly with JavaScript turned off.

## What is in the folder

| File | What it is |
| --- | --- |
| `index.html` | The whole site: hero, welcome, schedule, venue and travel, hotels, gallery, gifts (olive trees), RSVP, footer |
| `thanks.html` | The page guests see after sending the RSVP |
| `thanks-trees.html` | The page after reserving olive trees: repeats the bank details and the PayPal and cash notes |
| `css/styles.css` | All styling, with the colours and fonts defined at the top |
| `js/main.js` | Countdown, lightbox, language toggle, calendar download, olive-tree form, sticky-nav highlighting |
| `js/qr.js` | A small QR-code generator for the bank-transfer code (no library) |
| `js/head.js` | Tiny script that restores the saved language before the page paints |
| `images/` | Hero photo, gallery images, olive tree and sprig drawings, favicons, the social-preview image |
| `lingling-and-max.ics` | Calendar file (used when JavaScript is off; with JS the file is generated in the chosen language) |
| `netlify.toml` | Netlify settings: publish folder, security and privacy headers, functions |
| `netlify/functions/submission-created.js` | Copies every form submission into a Notion database (see below) |
| `DESIGN_AUDIT.md`, `DESIGN_SYSTEM.md` | The design audit (scores, guest journeys, open decisions) and the design tokens the stylesheet follows |

## Netlify (done)

The project `lingling-and-max` on Netlify deploys from the `main` branch of `maximilianjaegerprivat-gif/lingling-and-max-wedding` on GitHub. Every push to `main` goes live within a minute.

If it ever has to be set up again: Netlify → Add new project → Import from GitHub → pick the repository → leave the build command empty and the publish directory as `.` (both are in `netlify.toml`) → Deploy. New projects start **private**; click **Make public** on the project overview. Under **Forms** switch on **Enable form detection** once.

### Forms: RSVP and olive trees

Both forms use Netlify Forms, nothing to host.

- **Where replies are listed:** Netlify → project → **Forms**. `rsvp` holds the replies (name, email, attending, days, guests, dietary notes, message, lang); `olive-trees` holds the tree reservations (name for the plaque, email, number of trees, chosen payment method, lang). Both can be exported as CSV.
- **Email notifications:** Forms → **Submission notifications** → **Add notification** → *Email notification*, once per form, with the address that should receive each entry.
- **Spam:** both forms have a hidden honeypot field and Netlify filters the rest. Flagged entries appear under *Spam*.
- The free plan includes 100 submissions per month across both forms. If the invitation goes out to everyone at once, RSVPs plus tree reservations can exceed that in one month: either upgrade Netlify Forms for those months or send the link in waves and watch Forms → Usage.

### Replies in Notion (automatic copy)

`netlify/functions/submission-created.js` runs on Netlify after every form submission and adds a row to the Notion database **Wedding RSVP** (under LIFE → Max and Lingling → Wedding Kitzbühel), so RSVPs and olive-tree reservations also appear in Notion. Netlify's own Forms list keeps every entry regardless.

What is already set up (October 2026):

- Notion connection **Wedding site** (Developer tools → Connections) with content access to the Wedding RSVP database.
- Netlify environment variable `NOTION_DATABASE_ID` = `895bc95144ae4d8f93927d77224e4d65` (the 32 characters at the end of the database URL).
- The function reuses the columns that already exist in the database (Name, Amount of people, Email address, Comments) and adds the ones it still needs on the first submission (Form, Attending, Days, Dietary, Trees, Payment, Language, Submitted, Netlify ID). "Rooms needed" is not filled by the website.

Still needed once: the connection's secret token. Open the connection in Notion, copy the **API token** (Configuration tab), then in Netlify → project → **Project configuration → Environment variables** add `NOTION_TOKEN` with that value (tick "Contains secret values" and paste it into the Production field). Then **Deploys → Trigger deploy** once so the function picks it up, send one test reply from the website and check the database. The function's log is under **Logs → Functions** if something is off.

Without `NOTION_TOKEN` the function does nothing; the website and Netlify Forms work the same either way.

### Custom domain (optional)

Domain management → **Add a domain**. Netlify shows the DNS records for the registrar, or registers the name itself. HTTPS is automatic. Afterwards update the `https://lingling-and-max.netlify.app/` links in `index.html` (canonical URL, Open Graph tags), `js/main.js` (`SITE_URL`) and `lingling-and-max.ics`.

## Things to fill in before the link goes out

Search `index.html` for `PLACEHOLDER`. The important ones:

1. **Bank details** for the olive trees: in the gifts section, the `<dl class="bank">` element carries `data-holder`, `data-iban` and `data-bic` (used for the QR code) and shows the same values as text. IBAN and account holder (Maximilian Jaeger) are in; the BIC `NTSBDEB1XXX` was derived from the IBAN (N26).
2. **PayPal link:** the `data-paypal` and `href` on the PayPal button, `https://paypal.me/PLACEHOLDER`. Create a PayPal.me name at paypal.me and put the full link there. The amount is added automatically (`/280EUR` for two trees).
3. **The church** for the ceremony, the exact spot for Friday's get-together, dress codes, travel details (shuttles, parking).
4. **Hotels:** everyone stays at the Grandhotel Kitzbühel; how the rooms are booked still needs a sentence.
5. **RSVP deadline**, the church-to-hotel transfer after the ceremony, the time of the Sunday breakfast, arrival advice for guests from abroad (visa invitation letters), and a day-of contact number. The audit lists all open points in `DESIGN_AUDIT.md`, section 10.
6. **Contact email** in the footer (`hello@example.com`).
7. **Hero photo:** `images/hero.jpg` was cropped from the invitation card (728 px wide). Drop in the original photo at full resolution under the same name.

## How the olive-tree gift works

Guests choose the number of trees (€140 each), see the total, enter their name for the plaque, pick a payment method and send the small form. Nothing is charged on the website itself:

- **Bank transfer:** shows the account details, a copy button, and a QR code in the European EPC/GiroCode format with the amount and reference pre-filled. Most banking apps in Germany and Austria scan it directly.
- **PayPal:** opens your PayPal.me page with the amount pre-filled (a link, so no PayPal script is loaded on the site).
- **Cash:** the red-envelope note from the card.

The form entry tells you who reserved how many trees and how they intend to pay; match it against the bank or PayPal account. The price lives in one place: `data-price="140"` on the form in `index.html` (the texts mention €140 too).

## Editing the site

### Texts

Every text exists three times in `index.html`, English, German and Chinese, right next to each other:

```html
<span lang="en">Welcome</span><span lang="de">Willkommen</span><span lang="zh">欢迎</span>
<p lang="en">A whole paragraph…</p>
<p lang="de">Ein ganzer Absatz…</p>
<p lang="zh">一整段文字……</p>
```

Edit all three, keep the `lang` attributes (Chinese is tagged `zh-Hans`). Form placeholders, labels for screen readers and image descriptions carry the other languages in `data-placeholder-de` / `data-placeholder-zh`, `data-aria-label-…` and `data-alt-…` attributes.

To send guests straight to a language, add it to the link: `https://lingling-and-max.netlify.app/?lang=zh` or `?lang=de`. The choice is remembered on their device.

> **The German and the Chinese are drafts** and should be checked by us (and Lingling's family) before the site goes out. Same for the event titles in `js/main.js` (used for the calendar file).

### Dates and times

If the schedule changes, update it in three places: the texts in `index.html`, the `CEREMONY` and `EVENTS` blocks at the top of `js/main.js` (countdown and calendar download), and `lingling-and-max.ics` (the no-JavaScript calendar file). Times are Europe/Vienna.

### Photos

- **Gallery:** empty on purpose for now. To fill it, add list items inside `<ul class="gallery">` in the gallery section of `index.html`, each an `<a>` wrapping an `<img>` with the file name, `alt` text and `data-caption-en` / `data-caption-de` captions; the lightbox picks them up automatically. JPGs about 1600 px wide work best. Candidate photos from the Grandhotel and Bei Tomschy websites are in the git history (commit 0a662ba) if we want them back.
- **Hero:** `images/hero.jpg`, see above. The page shows the whole photo on phones and crops the top and bottom a little on wide screens.
- **Social preview:** `images/og-image.jpg` (1200 × 630) is what WhatsApp, iMessage and the like show when the link is shared. It is rendered from `images/og-image.svg`; on a Mac: `sips -s format jpeg -s formatOptions 85 images/og-image.svg --out images/og-image.jpg`.
- **Olive tree with the plaque:** `images/olive-tree.svg`, the names are plain text inside the file.

### Colours and fonts

Defined at the top of `css/styles.css` as variables and documented in `DESIGN_SYSTEM.md`: white paper (`--paper`), a faint green-grey band (`--paper-tint`), the sage RSVP band (`--paper-sage`), forest-green ink (`--green`, `--green-body`, `--green-muted`), one gold for the ampersand and ornaments (`--gold`) and a darker gold for small capitals (`--gold-text`), neutral hairlines (`--line`, `--line-strong`). The typeface is the system serif stack (Baskerville on Apple devices, Palatino Linotype or Garamond on Windows, Noto Serif on Android; Songti or SimSun for Chinese), so nothing is downloaded.

If you ever replace a photo under the same file name, add `?v=2` to its `src` (and to the `og:image` URL), because `netlify.toml` lets browsers cache images for a week.

## Running it locally

Any static server works. With Python:

```bash
python3 -m http.server 8787
```

Then open http://localhost:8787. The two forms only work on Netlify.

## Privacy and headers

`netlify.toml` sends a strict Content-Security-Policy: the browser may only load files from the site itself. If you ever add an embedded map, video or external script (for example PayPal's hosted buttons), that policy needs extending or the content stays blank.

## Version 2 plan: live tree counter and admin area

Goal: show how many trees have already been planted, let guests reserve trees with a confirmation, and give us a small admin area. Still no third-party requests from the public page.

- **Database:** Supabase (Postgres). Suggested tables: `trees` (reservation: guest name, email, number of trees, payment method, status, created at) and `payments` (confirmed amounts). If a `supabase/` folder exists in this project, its schema is the starting point.
- **Backend:** Netlify Functions in `netlify/functions/`. The browser only talks to `/.netlify/functions/...` on our own domain; the functions talk to Supabase with the service key stored as a Netlify environment variable. Validated and rate-limited server-side.
- **Admin area:** `admin.html`, protected with Netlify Identity (or a shared password checked in a function). Lists reservations, lets us mark payments as received and plaques as made, exports CSV.
- **Front end:** the olive-tree form posts to the function instead of Netlify Forms and shows a live counter; without JavaScript it keeps working as today.
