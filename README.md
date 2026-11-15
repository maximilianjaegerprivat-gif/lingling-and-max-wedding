# Lingling & Max — Wedding 2027

The public wedding website for Lingling and Max: one page, English with German and Chinese toggles, hosted on Netlify at **https://lingling-and-max.netlify.app**. The wedding is on Saturday 10 July 2027 at the Grandhotel Kitzbühel (Malinggasse 12, 6370 Kitzbühel), with a welcome evening on Friday 9 July and a farewell breakfast on Sunday 11 July.

Plain HTML, CSS and vanilla JavaScript. No framework, no build step, no dependencies, no third-party requests (no fonts, analytics, maps, payment scripts or CDN files), so no cookie banner is needed. Everything reads correctly with JavaScript turned off.

## What is in the folder

| File | What it is |
| --- | --- |
| `index.html` | The whole site: hero, welcome, schedule, venue and travel, hotels, RSVP, gifts (olive trees), footer |
| `thanks.html` | The page guests see after sending the RSVP |
| `thanks-trees.html` | The page after reserving olive trees: repeats the bank details and the PayPal, WeChat and cash notes, and shows the WeChat code to guests who chose WeChat Pay |
| `css/styles.css` | All styling, with the colours and fonts defined at the top |
| `js/main.js` | Language toggle, calendar download, olive-tree form, sticky-nav highlighting |
| `js/qr.js` | A small QR-code generator for the bank-transfer code (no library) |
| `js/head.js` | Tiny script that restores the saved language before the page paints |
| `images/` | Hero photo, the olive tree photo, the red-envelope picture, the PayPal and WeChat codes, olive sprig drawings, favicons, the social-preview image |
| `lingling-and-max.ics` | Calendar file (used when JavaScript is off; with JS the file is generated in the chosen language) |
| `netlify.toml` | Netlify settings: publish folder, security and privacy headers, functions |
| `netlify/functions/submission-created.js` | Copies every form submission into a Notion database (see below) |
| `DESIGN_AUDIT.md`, `DESIGN_SYSTEM.md` | The design audit (scores, guest journeys, open decisions) and the design tokens the stylesheet follows |

## Netlify (done)

The project `lingling-and-max` on Netlify deploys from the `main` branch of `maximilianjaegerprivat-gif/lingling-and-max-wedding` on GitHub. Every push to `main` goes live within a minute.

If it ever has to be set up again: Netlify → Add new project → Import from GitHub → pick the repository → leave the build command empty and the publish directory as `.` (both are in `netlify.toml`) → Deploy. New projects start **private**; click **Make public** on the project overview. Under **Forms** switch on **Enable form detection** once.

### Forms: RSVP and olive trees

Both forms use Netlify Forms, nothing to host.

- **Where replies are listed:** Netlify → project → **Forms**. `rsvp` holds the replies (name, email, attending, days, guests, rooms booked at the hotel, dietary notes, message, lang); `olive-trees` holds the gifts (name, email, number of trees, total in euros, chosen payment method, lang; entries from before 15 November 2026 may also carry gift and amount). Both can be exported as CSV.
- **Email notifications:** Forms → **Submission notifications** → **Add notification** → *Email notification*, once per form, with the address that should receive each entry.
- **Spam:** both forms have a hidden honeypot field and Netlify filters the rest. Flagged entries appear under *Spam*.
- The free plan includes 100 submissions per month across both forms. If the invitation goes out to everyone at once, RSVPs plus tree reservations can exceed that in one month: either upgrade Netlify Forms for those months or send the link in waves and watch Forms → Usage.

### Replies in Notion (automatic copy)

`netlify/functions/submission-created.js` runs on Netlify after every form submission and adds a row to the Notion database **Wedding RSVP** (under LIFE → Max and Lingling → Wedding Kitzbühel), so RSVPs and olive-tree reservations also appear in Notion. Netlify's own Forms list keeps every entry regardless.

What is already set up (October 2026):

- Notion connection **Wedding site** (Developer tools → Connections) with content access to the Wedding RSVP database.
- Netlify environment variable `NOTION_DATABASE_ID` = `895bc95144ae4d8f93927d77224e4d65` (the 32 characters at the end of the Wedding RSVP page URL). The function writes into the first database inside that page: the inline table **Replies**, which it created on the first submission (if the page ever has no database, it creates one again).
- Columns: Name, Form (RSVP or Olive tree; entries from before 15 November 2026 may say Own amount), Email, Attending, Days, Guests, Rooms (rooms booked at the hotel; empty if not answered), Dietary, Message, Trees, Amount (in euros: trees × price), Payment, Language, Submitted, Netlify ID. Columns you add by hand are left alone; if you rename one, the function adds the original name back on the next submission.

Still needed once: the connection's secret token. Open the connection in Notion, copy the **API token** (Configuration tab), then in Netlify → project → **Project configuration → Environment variables** add `NOTION_TOKEN` with that value (tick "Contains secret values" and paste it into the Production field). Then **Deploys → Trigger deploy** once so the function picks it up, send one test reply from the website and check the database. The function's log is under **Logs → Functions** if something is off.

Without `NOTION_TOKEN` the function does nothing; the website and Netlify Forms work the same either way.

### Custom domain (optional)

Domain management → **Add a domain**. Netlify shows the DNS records for the registrar, or registers the name itself. HTTPS is automatic. Afterwards update the `https://lingling-and-max.netlify.app/` links in `index.html` (canonical URL, Open Graph tags), `js/main.js` (`SITE_URL`) and `lingling-and-max.ics`.

## Things to fill in before the link goes out

Search `index.html` for `PLACEHOLDER`. The important ones:

1. **Bank details** for the olive trees: in the gifts section, the `<dl class="bank">` element carries `data-holder`, `data-iban` and `data-bic` (used for the QR code) and shows the same values as text. IBAN and account holder (Maximilian Jaeger) are in; the BIC `NTSBDEB1XXX` was derived from the IBAN (N26).
2. **PayPal link:** done. The PayPal button in the gifts section and the link on `thanks-trees.html` point to `https://paypal.me/maxandlingling` (attributes `data-paypal` and `href`; the profile shows "Maximilian Jaeger"). The amount is added automatically (`/150EUR` for one tree, `/300EUR` for two). The PayPal address `maxandlingling@gmail.com` is shown next to it for guests who prefer to send from the PayPal app.
3. **The church** for the ceremony and whether it starts at 11:00 or 12:00 (the page says "to be confirmed"), where Saturday's coffee and tea takes place, travel details (parking).
4. **Hotels:** done. Guests book directly with the Grandhotel Kitzbühel (email, phone, keyword "Hochzeit Max & Lingling", €239 per room and night, cancellation terms). If the hotel changes the rate or the terms, edit the accommodation section in `index.html`.
5. **RSVP deadline**, the church-to-hotel transfer after the ceremony, the time of the Sunday breakfast, arrival advice for guests from abroad (visa invitation letters), and a day-of contact number. The audit lists all open points in `DESIGN_AUDIT.md`, section 10.
6. **Contact email:** done. The footer of `index.html`, `thanks.html` and `thanks-trees.html` shows `maxandlingling@gmail.com`.
7. **Hero photo:** `images/hero.jpg` was cropped from the invitation card (728 px wide). Drop in the original photo at full resolution under the same name.

## How the olive-tree gift works

Guests choose a number of trees (€150 each), see the total, enter their name for the plaque, pick a payment method and send the small form. The payment methods are listed as the couple wants them: cash at the wedding (preselected), PayPal, bank transfer, WeChat Pay. Nothing is charged on the website itself:

- **Bank transfer:** shows the account details, a copy button, and a QR code in the European EPC/GiroCode format with the amount and reference pre-filled. Most banking apps in Germany and Austria scan it directly.
- **PayPal:** opens your PayPal.me page with the amount pre-filled (a link, so no PayPal script is loaded on the site). The thank-you page repeats the link, again with the amount. The panel also shows your PayPal QR code (`images/paypal-qr.png`, exported from the PayPal app); it opens the PayPal app without an amount, so guests type the amount there.
- **WeChat Pay:** shows Lingling's WeChat Pay code (`images/wechat-pay-qr.jpg`, cropped from the image exported in WeChat). WeChat pays in yuan, so the note asks for the equivalent of the euro total.
- **Cash in a red envelope** (the option's name): "Red envelopes in which you can put the money will be provided for you", with a picture of the red envelope box (`images/red-envelope.jpg`).

The form entry tells you who gave how many trees (plus the total in euros) and how they intend to pay; match it against the bank account, the PayPal account or Lingling's WeChat wallet (WeChat gifts arrive in yuan; the Amount column stays in euros). The price lives in one place: `data-price="150"` on the form in `index.html` (the texts mention €150 too, in `index.html` and `thanks-trees.html`).

To test the form, send it with one tree and choose cash: nothing is charged, and the entry appears under Netlify Forms and in the Notion table. To test a payment without spending €150, open `https://paypal.me/maxandlingling/1EUR` directly and pay €1 from a PayPal account other than the receiving one (PayPal does not let an account pay itself). The "My own amount" option was removed on 15 November 2026 at the couple's request.

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

If the schedule changes, update it in three places: the texts in `index.html`, the `EVENTS` block at the top of `js/main.js` (calendar download), and `lingling-and-max.ics` (the no-JavaScript calendar file). Times are Europe/Vienna.

### Photos

- **Gallery:** removed on 15 November 2026 at the couple's request (it was empty). The old markup, styles and image viewer are in the git history (commit 251cda6) if it should come back.
- **Hero:** `images/hero.jpg`, see above. The page shows the whole photo on phones and crops the top and bottom a little on wide screens.
- **Social preview:** `images/og-image.jpg` (1200 × 630) is what WhatsApp, iMessage and the like show when the link is shared. It is rendered from `images/og-image.svg`; on a Mac: `sips -s format jpeg -s formatOptions 85 images/og-image.svg --out images/og-image.jpg`.
- **Olive tree with the plaque:** the photo `images/olive-gift.jpg` at the top of the gifts section (1280 px wide; replace the file to change it). The earlier drawing `images/olive-tree.svg` is still in the folder but no longer used.

### Colours and fonts

Defined at the top of `css/styles.css` as variables and documented in `DESIGN_SYSTEM.md`: white paper (`--paper`), a faint green-grey band (`--paper-tint`), the sage RSVP band (`--paper-sage`), forest-green ink (`--green`, `--green-body`, `--green-muted`), one gold for the ampersand and ornaments (`--gold`) and a darker gold for small capitals (`--gold-text`), neutral hairlines (`--line`, `--line-strong`). There are two typefaces, both already on the guest's device so nothing is downloaded: a serif for headings and names (Baskerville on Apple devices, Palatino Linotype on Windows; Songti for Chinese) and a clean sans for all other text (San Francisco on Apple, Segoe UI on Windows, Roboto on Android; PingFang or Microsoft YaHei for Chinese). Sizes are set so everything reads at 100 % zoom.

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
