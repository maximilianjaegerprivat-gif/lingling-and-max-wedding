# Lingling & Max — Wedding 2027

The public wedding website for Lingling and Max: one page, English with a German toggle, hosted on Netlify at **https://lingling-and-max.netlify.app**. The wedding is on Saturday 10 July 2027 in Kitzbühel, with a welcome evening on Friday 9 July.

Plain HTML, CSS and vanilla JavaScript. No framework, no build step, no dependencies, no third-party requests (no fonts, analytics, maps, payment scripts or CDN files), so no cookie banner is needed. Everything reads correctly with JavaScript turned off.

## What is in the folder

| File | What it is |
| --- | --- |
| `index.html` | The whole site: hero, welcome, schedule, venue and travel, hotels, gallery, gifts (olive trees), RSVP, footer |
| `thanks.html` | The page guests see after sending the RSVP or the olive-tree form |
| `css/styles.css` | All styling, with the colours and fonts defined at the top |
| `js/main.js` | Countdown, day tabs, lightbox, EN/DE toggle, calendar download, olive-tree form, sticky-nav highlighting |
| `js/qr.js` | A small QR-code generator for the bank-transfer code (no library) |
| `js/head.js` | Tiny script that restores the saved language before the page paints |
| `images/` | Hero photo, gallery images, olive tree and sprig drawings, favicons, the social-preview image |
| `lingling-and-max.ics` | Calendar file (used when JavaScript is off; with JS the file is generated in the chosen language) |
| `netlify.toml` | Netlify settings: publish folder, security and privacy headers |

## Netlify (done)

The project `lingling-and-max` on Netlify deploys from the `main` branch of `maximilianjaegerprivat-gif/lingling-and-max-wedding` on GitHub. Every push to `main` goes live within a minute.

If it ever has to be set up again: Netlify → Add new project → Import from GitHub → pick the repository → leave the build command empty and the publish directory as `.` (both are in `netlify.toml`) → Deploy. New projects start **private**; click **Make public** on the project overview. Under **Forms** switch on **Enable form detection** once.

### Forms: RSVP and olive trees

Both forms use Netlify Forms, nothing to host.

- **Where replies are listed:** Netlify → project → **Forms**. `rsvp` holds the replies (name, email, attending, guests, dietary notes, message); `olive-trees` holds the tree reservations (name for the plaque, email, number of trees, chosen payment method). Both can be exported as CSV.
- **Email notifications:** Forms → **Submission notifications** → **Add notification** → *Email notification*, once per form, with the address that should receive each entry.
- **Spam:** both forms have a hidden honeypot field and Netlify filters the rest. Flagged entries appear under *Spam*.
- The free plan includes 100 submissions per month across all forms.

### Custom domain (optional)

Domain management → **Add a domain**. Netlify shows the DNS records for the registrar, or registers the name itself. HTTPS is automatic. Afterwards update the `https://lingling-and-max.netlify.app/` links in `index.html` (canonical URL, Open Graph tags), `js/main.js` (`SITE_URL`) and `lingling-and-max.ics`.

## Things to fill in before the link goes out

Search `index.html` for `PLACEHOLDER`. The important ones:

1. **Bank details** for the olive trees: in the gifts section, the `<dl class="bank">` element carries `data-holder`, `data-iban` and `data-bic` (used for the QR code) and shows the same values as text. Replace all of them.
2. **PayPal link:** the `data-paypal` and `href` on the PayPal button, `https://paypal.me/PLACEHOLDER`. Create a PayPal.me name at paypal.me and put the full link there. The amount is added automatically (`/280EUR` for two trees).
3. **The church** for the ceremony, the exact spot for Friday's get-together, dress codes, travel details (shuttles, parking).
4. **Hotels:** booking code `MAXLING2027`, the hold date, further hotel tips.
5. **Contact email** in the footer (`hello@example.com`).
6. **Hero photo:** `images/hero.jpg` was cropped from the invitation card (728 px wide). Drop in the original photo at full resolution under the same name.

## How the olive-tree gift works

Guests choose the number of trees (€140 each), see the total, enter their name for the plaque, pick a payment method and send the small form. Nothing is charged on the website itself:

- **Bank transfer:** shows the account details, a copy button, and a QR code in the European EPC/GiroCode format with the amount and reference pre-filled. Most banking apps in Germany and Austria scan it directly.
- **PayPal:** opens your PayPal.me page with the amount pre-filled (a link, so no PayPal script is loaded on the site).
- **Cash:** the red-envelope note from the card.

The form entry tells you who reserved how many trees and how they intend to pay; match it against the bank or PayPal account. The price lives in one place: `data-price="140"` on the form in `index.html` (the texts mention €140 too).

## Editing the site

### Texts

Every text exists twice in `index.html`, English and German, right next to each other:

```html
<span lang="en">Welcome</span><span lang="de">Willkommen</span>
<p lang="en">A whole paragraph…</p>
<p lang="de">Ein ganzer Absatz…</p>
```

Edit both, keep the `lang` attributes. Form placeholders carry the German version in a `data-placeholder-de` attribute.

> **The German is a draft** and should be checked by us before the site goes out. Same for the German event titles in `js/main.js` (used for the calendar file).

### Dates and times

If the schedule changes, update it in three places: the texts in `index.html`, the `CEREMONY` and `EVENTS` blocks at the top of `js/main.js` (countdown and calendar download), and `lingling-and-max.ics` (the no-JavaScript calendar file). Times are Europe/Vienna.

### Photos

- **Gallery:** the images sit in the gallery section of `index.html`, each as an `<a>` wrapping an `<img>` with the file name, `alt` text and the `data-caption-en` / `data-caption-de` captions. Add or remove entries as you like; JPGs about 1600 px wide work best. The remaining `gallery-*.svg` files are drawings standing in for photos.
- **Hero:** `images/hero.jpg`, see above. The page shows the whole photo on phones and crops the top and bottom a little on wide screens.
- **Social preview:** `images/og-image.png` (1200 × 630) is what WhatsApp, iMessage and the like show when the link is shared. It is rendered from `images/og-image.svg`; on a Mac: `sips -s format png images/og-image.svg --out images/og-image.png`.
- **Olive tree with the plaque:** `images/olive-tree.svg`, the names are plain text inside the file.

### Colours and fonts

Defined at the top of `css/styles.css` as variables (`--green`, `--gold`, `--ivory`, …). The typeface is the system serif stack (Baskerville on Apple devices, Garamond or Palatino Linotype on Windows, Noto Serif on Android), so nothing is downloaded.

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
