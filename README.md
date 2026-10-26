# Lingling & Max — Wedding 2027

The public wedding website for Lingling and Max: one page, English with a German toggle, hosted on Netlify at **https://lingling-and-max.netlify.app**.

Plain HTML, CSS and vanilla JavaScript. No framework, no build step, no dependencies, no third-party requests (no fonts, analytics, maps or CDN scripts), so no cookie banner is needed. Everything reads correctly with JavaScript turned off.

## What is in the folder

| File | What it is |
| --- | --- |
| `index.html` | The whole site: hero, welcome, schedule, venue and travel, hotels, gallery, gifts, RSVP, footer |
| `thanks.html` | The page guests see after sending the RSVP form |
| `css/styles.css` | All styling, with the colours and fonts defined at the top |
| `js/main.js` | Countdown, day tabs, lightbox, EN/DE toggle, calendar download, sticky-nav highlighting |
| `js/head.js` | Tiny script that restores the saved language before the page paints |
| `images/` | Hero scene, gallery placeholders, olive sprig, favicons, the social-preview image |
| `lingling-and-max.ics` | Calendar file (used when JavaScript is off; with JS the file is generated in the chosen language) |
| `netlify.toml` | Netlify settings: publish folder, security and privacy headers |

## Deploy to Netlify (two minutes)

1. The code lives on GitHub at `maximilianjaegerprivat-gif/lingling-and-max-wedding`.
2. Go to [app.netlify.com](https://app.netlify.com) and log in with GitHub.
3. **Add new site → Import an existing project → GitHub**, pick `lingling-and-max-wedding`.
4. Leave the build command **empty** and the publish directory as `.` (both are already in `netlify.toml`). Set the project name to `lingling-and-max` and click **Deploy**.
5. New Netlify projects start **private** (visitors get a login page). On the project overview click **Make public**.
6. Every later push to `main` deploys automatically.

*Done on 26 October 2026: the project `lingling-and-max` exists, is public and deploys from this repository.*

### Setting the site name

Site configuration → General → Site details → **Change site name** → `lingling-and-max`. The address becomes `https://lingling-and-max.netlify.app`.

### The RSVP form

The form uses Netlify Forms. **Forms → Enable form detection** must be switched on once (done), after which every deploy registers the `rsvp` form.

- **Where replies are listed:** Netlify dashboard → your site → **Forms** → `rsvp`. Each submission shows name, email, attending, guests, dietary notes and message. You can export everything as CSV.
- **Email notifications:** Site configuration → **Notifications** → **Form submission notifications** → **Add notification** → *Email notification* → form `rsvp`, enter the address that should receive each reply.
- **Spam:** the form has a hidden honeypot field; Netlify also filters spam. Flagged entries appear under *Spam* in the Forms tab.
- The free plan includes 100 submissions per month, plenty for a wedding.

### Custom domain (later)

Domain management → **Add a domain**. Netlify shows the DNS records to add at your registrar (or you can move the DNS to Netlify). HTTPS is set up automatically. Afterwards, update the `https://lingling-and-max.netlify.app/` links in `index.html` (canonical URL, Open Graph tags) and in `js/main.js` (`SITE_URL`).

## Editing the site

### Texts

Every text exists twice in `index.html`, English and German, right next to each other:

```html
<span lang="en">Welcome</span><span lang="de">Willkommen</span>
<p lang="en">A whole paragraph…</p>
<p lang="de">Ein ganzer Absatz…</p>
```

Edit both, keep the `lang` attributes. Form placeholders carry the German version in a `data-placeholder-de` attribute. Spots we still need to confirm are marked with `<!-- PLACEHOLDER -->` comments (booking code, contact email, gallery photos, gift ideas).

> **The German is a draft.** It was written for the first version and should be checked by us before the site goes out. Same for the German event titles in `js/main.js` (used for the calendar file).

### Dates and times

If the date or schedule changes, update it in three places: the texts in `index.html`, the `CEREMONY` and `EVENTS` blocks at the top of `js/main.js` (countdown and calendar download), and `lingling-and-max.ics` (the no-JavaScript calendar file). Times are Europe/Berlin.

### Photos

- **Gallery:** replace `images/gallery-1.svg` … `gallery-6.svg` with photos (JPG, roughly 1600 px wide, 4:3 works best) and update the six `<img>`/`<a>` entries in the gallery section of `index.html` (file names, `alt` texts and the `data-caption-en` / `data-caption-de` captions). Add or remove entries as you like.
- **Hero:** `images/hero.svg` is an illustration. A wide photo (about 1600 × 900) can replace it; keep it calm at the top so the names stay readable.
- **Social preview:** `images/og-image.png` (1200 × 630) is what WhatsApp, iMessage and the like show when the link is shared. It was rendered from `images/og-image.svg`; on a Mac you can re-render it with `sips -s format png images/og-image.svg --out images/og-image.png`, or simply export a 1200 × 630 PNG from any tool.
- **Favicon:** `images/favicon.svg`, plus the PNG versions made the same way.

### Colours and fonts

Defined at the top of `css/styles.css` as variables (`--green`, `--gold`, `--ivory`, …). The typeface is the system serif stack (Baskerville on Apple devices, Garamond or Palatino Linotype on Windows, Noto Serif on Android), so nothing is downloaded.

## Running it locally

Any static server works. With Python:

```bash
python3 -m http.server 8787
```

Then open http://localhost:8787. The RSVP form only works on Netlify.

## Privacy and headers

`netlify.toml` sends a strict Content-Security-Policy: the browser may only load files from the site itself. If you ever add an embedded map, video or external script, that policy needs extending or the content stays blank.

## Version 2 plan: gift registry and admin area

Goal: guests can **reserve** a gift idea or **contribute** an amount towards the honeymoon fund, and we can manage everything in a small admin area. Still no third-party requests from the public page.

- **Database:** Supabase (Postgres). Suggested tables: `gifts` (title in both languages, description, type `item` or `fund`, target amount, image, sort order, active), `reservations` (gift, guest name, email, message, status, created at) and `contributions` (gift, guest name, email, amount, message, status, created at). If a `supabase/` folder exists in this project, its schema is the starting point.
- **Backend:** Netlify Functions in a `netlify/functions/` folder. The browser only talks to `/.netlify/functions/...` on our own domain; the functions talk to Supabase with the service key stored as a Netlify environment variable. Public functions: list gifts, reserve, contribute. Rate-limited and validated server-side.
- **Admin area:** `admin.html`, protected with Netlify Identity (or a single shared password checked in a function). Lists reservations and contributions, lets us mark gifts as fulfilled, hide ideas, export CSV.
- **Payments:** contributions are recorded as pledges with our bank details or PayPal link shown afterwards, so the public page still loads no third-party scripts.
- **Front end:** the gifts section in `index.html` becomes cards with "Reserve" and "Contribute" buttons; without JavaScript it keeps showing the plain list.

## Notes

- Gallery images and the hero are illustrations drawn for the first version; they are meant to be replaced by photographs.
- The social-preview PNG was rendered on a Mac with the built-in `sips` tool, so no extra software is needed.
