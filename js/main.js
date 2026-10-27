/* =====================================================================
   Lingling & Max — Wedding 2027
   Vanilla JavaScript, no dependencies. Everything here is progressive
   enhancement: the page reads fine without it.
   ===================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;

  /* ---------------------------------------------------------------
     Event data (single source of truth for countdown + calendar file)
     Times are local to Europe/Vienna (Kitzbühel).
     --------------------------------------------------------------- */
  var TIMEZONE = 'Europe/Vienna'; // Kitzbühel
  var SITE_URL = 'https://lingling-and-max.netlify.app/';

  var CEREMONY = { y: 2027, m: 7, d: 10, h: 12, min: 0 };

  var EVENTS = [
    {
      uid: 'friday-welcome-2027@lingling-and-max.netlify.app',
      start: [2027, 7, 9, 19, 0],
      end: [2027, 7, 9, 22, 0],
      summary: { en: 'Lingling & Max — Welcome Get-Together', de: 'Lingling & Max – Willkommensabend', zh: 'Lingling & Max — 欢迎聚会' },
      location: 'Grandhotel Kitzbühel, Malinggasse 12, 6370 Kitzbühel, Austria',
      description: {
        en: 'Light bites and drinks. Arrive, relax and enjoy the evening with us!',
        de: 'Kleine Häppchen und Drinks. Ankommen, entspannen und den Abend mit uns genießen!',
        zh: '小食与饮品。抵达、放松，和我们一起享受这个夜晚！'
      }
    },
    {
      uid: 'sunday-breakfast-2027@lingling-and-max.netlify.app',
      start: [2027, 7, 11, 10, 0],
      end: [2027, 7, 11, 13, 0],
      summary: { en: 'Lingling & Max — Farewell Breakfast', de: 'Lingling & Max – Abschiedsfrühstück', zh: 'Lingling & Max — 告别早餐' },
      location: 'Grandhotel Kitzbühel, Malinggasse 12, 6370 Kitzbühel, Austria',
      description: {
        en: 'Coffee, pretzels, and one last morning together before everyone travels home.',
        de: 'Kaffee, Brezen und ein letzter gemeinsamer Morgen, bevor alle nach Hause fahren.',
        zh: '咖啡、碱水面包，以及大家各自踏上归途前最后一个共度的早晨。'
      }
    },
    {
      uid: 'saturday-wedding-2027@lingling-and-max.netlify.app',
      start: [2027, 7, 10, 11, 30],
      end: [2027, 7, 11, 2, 0],
      summary: { en: 'Lingling & Max — The Wedding', de: 'Lingling & Max – Die Hochzeit', zh: 'Lingling & Max — 婚礼' },
      location: 'Church & Grandhotel Kitzbühel, Malinggasse 12, 6370 Kitzbühel, Austria',
      description: {
        en: '11:30 Arrival at the church · 12:00 Church ceremony · 13:30 Coffee & tea on the terrace · 14:00 Group photos & bouquet throw · 17:00 Cocktail reception · 18:30 Dinner · 21:30 Opening dance · 21:40 Party!',
        de: '11:30 Ankunft an der Kirche · 12:00 Kirchliche Trauung · 13:30 Kaffee & Tee auf der Terrasse · 14:00 Gruppenfotos & Brautstraußwurf · 17:00 Cocktail-Empfang · 18:30 Abendessen · 21:30 Eröffnungstanz · 21:40 Party!',
        zh: '11:30 抵达教堂 · 12:00 教堂婚礼仪式 · 13:30 露台咖啡与茶 · 14:00 合影与抛花球 · 17:00 鸡尾酒会 · 18:30 晚宴 · 21:30 开场舞 · 21:40 派对！'
      }
    }
  ];

  var TITLES = {
    en: 'Lingling & Max — Wedding 2027',
    de: 'Lingling & Max — Hochzeit 2027',
    zh: 'Lingling & Max — 2027 婚礼'
  };
  var LANGS = ['en', 'de', 'zh'];

  /* ---------------------------------------------------------------
     Time zone helpers (no libraries): convert a Europe/Vienna wall-clock
     time to a UTC timestamp using Intl, with a fixed fallback.
     --------------------------------------------------------------- */
  function tzOffsetMs(utcMs, tz) {
    var dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hourCycle: 'h23',
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric'
    });
    var map = {};
    dtf.formatToParts(new Date(utcMs)).forEach(function (p) { map[p.type] = p.value; });
    var asUtc = Date.UTC(+map.year, +map.month - 1, +map.day, +map.hour % 24, +map.minute, +map.second);
    return asUtc - utcMs;
  }

  function zonedToUtc(y, m, d, h, min, tz) {
    var guess = Date.UTC(y, m - 1, d, h, min, 0);
    var offset = tzOffsetMs(guess, tz);
    var utc = guess - offset;
    var check = tzOffsetMs(utc, tz);
    if (check !== offset) { utc = guess - check; }
    return utc;
  }

  function localToUtc(y, m, d, h, min) {
    try {
      if (window.Intl && Intl.DateTimeFormat.prototype.formatToParts) {
        return zonedToUtc(y, m, d, h, min, TIMEZONE);
      }
    } catch (e) { /* fall through */ }
    // Fallback: Central European Summer Time (UTC+2) applies in July.
    return Date.UTC(y, m - 1, d, h - 2, min, 0);
  }

  /* ---------------------------------------------------------------
     Language toggle (EN / DE / ZH), remembered in localStorage
     --------------------------------------------------------------- */
  var ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];

  function getLang() {
    var l = root.getAttribute('data-lang');
    return LANGS.indexOf(l) > 0 ? l : 'en';
  }

  function applyAttrTranslations(lang) {
    ATTRS.forEach(function (attr) {
      var nodes = doc.querySelectorAll('[data-' + attr + '-de]');
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var enKey = 'data-' + attr + '-en';
        if (!el.hasAttribute(enKey)) { el.setAttribute(enKey, el.getAttribute(attr) || ''); }
        var key = 'data-' + attr + '-' + lang;
        el.setAttribute(attr, el.getAttribute(lang !== 'en' && el.hasAttribute(key) ? key : enKey));
      }
    });
  }

  function setLang(lang, persist) {
    lang = String(lang || 'en').split('-')[0];
    lang = LANGS.indexOf(lang) > 0 ? lang : 'en';
    root.setAttribute('data-lang', lang);
    root.lang = lang === 'zh' ? 'zh-Hans' : lang;
    if (doc.body && doc.body.getAttribute('data-page') === 'home') { doc.title = TITLES[lang]; }
    var langInputs = doc.querySelectorAll('input[name="lang"]');
    for (var li = 0; li < langInputs.length; li++) { langInputs[li].value = lang; }
    applyAttrTranslations(lang);
    var buttons = doc.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', buttons[i].getAttribute('data-set-lang') === lang ? 'true' : 'false');
    }
    if (persist) {
      try { localStorage.setItem('lm-lang', lang); } catch (e) { /* ignore */ }
    }
    doc.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  doc.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-set-lang]');
    if (btn) { setLang(btn.getAttribute('data-set-lang'), true); }
  });

  setLang(getLang(), false);

  /* ---------------------------------------------------------------
     Countdown to the ceremony
     --------------------------------------------------------------- */
  (function countdown() {
    var box = doc.getElementById('countdown');
    if (!box) { return; }
    var today = doc.getElementById('countdown-today');
    var past = doc.getElementById('countdown-past');
    var target = localToUtc(CEREMONY.y, CEREMONY.m, CEREMONY.d, CEREMONY.h, CEREMONY.min);
    var endOfDay = localToUtc(CEREMONY.y, CEREMONY.m, CEREMONY.d + 1, 0, 0);
    var fields = {};
    ['days', 'hours', 'minutes'].forEach(function (u) {
      fields[u] = box.querySelector('[data-unit="' + u + '"]');
    });
    var timer = null;

    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function tick() {
      var now = Date.now();
      var diff = target - now;
      if (diff <= 0) {
        box.hidden = true;
        if (now < endOfDay) { today.hidden = false; past.hidden = true; }
        else { past.hidden = false; today.hidden = true; }
        if (timer) { clearInterval(timer); }
        return;
      }
      var s = Math.floor(diff / 1000);
      var days = Math.floor(s / 86400);
      var hours = Math.floor((s % 86400) / 3600);
      var minutes = Math.floor((s % 3600) / 60);
      fields.days.textContent = String(days);
      fields.hours.textContent = pad(hours);
      fields.minutes.textContent = pad(minutes);
    }

    tick();
    timer = setInterval(tick, 30000);
  })();

  /* ---------------------------------------------------------------
     Add to calendar: build an .ics file in the current language
     --------------------------------------------------------------- */
  function icsText(s) {
    return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  }
  function icsLocal(parts) {
    function p(n) { return n < 10 ? '0' + n : String(n); }
    return parts[0] + p(parts[1]) + p(parts[2]) + 'T' + p(parts[3]) + p(parts[4]) + '00';
  }
  function icsStamp() {
    return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }
  function fold(line) {
    // RFC 5545: lines longer than 75 octets are folded with CRLF + space.
    var out = [];
    while (line.length > 70) { out.push(line.slice(0, 70)); line = ' ' + line.slice(70); }
    out.push(line);
    return out.join('\r\n');
  }

  function buildIcs(lang) {
    var lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Lingling and Max//Wedding 2027//' + lang.toUpperCase(),
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:' + icsText(lang === 'de' ? 'Hochzeit Lingling & Max' : lang === 'zh' ? 'Lingling & Max 婚礼' : 'Lingling & Max Wedding'),
      'X-WR-TIMEZONE:' + TIMEZONE,
      'BEGIN:VTIMEZONE',
      'TZID:' + TIMEZONE,
      'BEGIN:DAYLIGHT',
      'TZOFFSETFROM:+0100',
      'TZOFFSETTO:+0200',
      'TZNAME:CEST',
      'DTSTART:19700329T020000',
      'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
      'END:DAYLIGHT',
      'BEGIN:STANDARD',
      'TZOFFSETFROM:+0200',
      'TZOFFSETTO:+0100',
      'TZNAME:CET',
      'DTSTART:19701025T030000',
      'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
      'END:STANDARD',
      'END:VTIMEZONE'
    ];
    var stamp = icsStamp();
    EVENTS.forEach(function (ev) {
      lines.push(
        'BEGIN:VEVENT',
        'UID:' + ev.uid,
        'DTSTAMP:' + stamp,
        'DTSTART;TZID=' + TIMEZONE + ':' + icsLocal(ev.start),
        'DTEND;TZID=' + TIMEZONE + ':' + icsLocal(ev.end),
        'SUMMARY:' + icsText(ev.summary[lang]),
        'LOCATION:' + icsText(ev.location),
        'DESCRIPTION:' + icsText(ev.description[lang] + '\n' + SITE_URL),
        'URL:' + SITE_URL,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    });
    lines.push('END:VCALENDAR');
    return lines.map(fold).join('\r\n') + '\r\n';
  }

  (function calendarLink() {
    var link = doc.getElementById('add-to-calendar');
    if (!link || !window.Blob || !window.URL || !URL.createObjectURL) { return; }
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var blob = new Blob([buildIcs(getLang())], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = doc.createElement('a');
      a.href = url;
      a.download = 'lingling-and-max.ics';
      doc.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    });
  })();

  /* ---------------------------------------------------------------
     Schedule: day tabs (without JS all days are simply listed)
     --------------------------------------------------------------- */
  (function tabs() {
    var wrap = doc.getElementById('schedule-tabs');
    if (!wrap) { return; }
    var list = wrap.querySelector('.tabs__list');
    if (!list) { return; }
    var links = Array.prototype.slice.call(list.querySelectorAll('.tabs__tab'));
    var panels = links.map(function (a) { return doc.getElementById(a.getAttribute('href').slice(1)); });
    if (panels.some(function (p) { return !p; })) { return; }

    list.setAttribute('role', 'tablist');
    links.forEach(function (a, i) {
      a.setAttribute('role', 'tab');
      a.id = a.id || 'tab-' + panels[i].id;
      a.setAttribute('aria-controls', panels[i].id);
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].setAttribute('aria-labelledby', a.id);
    });

    function select(i, focus) {
      links.forEach(function (a, j) {
        var on = i === j;
        a.setAttribute('aria-selected', on ? 'true' : 'false');
        a.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) { links[i].focus(); }
    }

    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        select(i);
      });
      a.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') { n = (i + 1) % links.length; }
        else if (e.key === 'ArrowLeft') { n = (i - 1 + links.length) % links.length; }
        else if (e.key === 'Home') { n = 0; }
        else if (e.key === 'End') { n = links.length - 1; }
        if (n !== null) { e.preventDefault(); select(n, true); }
      });
    });

    function fromHash() {
      var id = location.hash.replace('#', '');
      var i = panels.map(function (p) { return p.id; }).indexOf(id);
      return i;
    }

    var initial = fromHash();
    select(initial >= 0 ? initial : 1); // Saturday, the wedding day, by default
    window.addEventListener('hashchange', function () {
      var i = fromHash();
      if (i >= 0) { select(i); }
    });
  })();

  /* ---------------------------------------------------------------
     Gallery lightbox (uses the native <dialog>)
     --------------------------------------------------------------- */
  (function lightbox() {
    var dlg = doc.getElementById('lightbox');
    var links = Array.prototype.slice.call(doc.querySelectorAll('.gallery__link'));
    if (!dlg || !links.length || typeof dlg.showModal !== 'function') { return; }

    var img = doc.getElementById('lightbox-img');
    var cap = doc.getElementById('lightbox-caption');
    var index = 0;
    var opener = null;

    function caption(a) {
      return a.getAttribute('data-caption-' + getLang()) || a.getAttribute('data-caption-en') || '';
    }

    function show(i) {
      index = (i + links.length) % links.length;
      var a = links[index];
      var thumb = a.querySelector('img');
      img.src = a.getAttribute('href');
      img.alt = thumb ? thumb.alt : '';
      cap.textContent = caption(a);
    }

    function open(i, trigger) {
      opener = trigger || null;
      show(i);
      dlg.showModal();
    }

    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        open(i, a);
      });
    });

    dlg.querySelector('.lightbox__close').addEventListener('click', function () { dlg.close(); });
    dlg.querySelector('.lightbox__prev').addEventListener('click', function () { show(index - 1); });
    dlg.querySelector('.lightbox__next').addEventListener('click', function () { show(index + 1); });

    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { show(index + 1); }
      else if (e.key === 'ArrowLeft') { show(index - 1); }
    });

    // Click on the dark backdrop (outside the figure and buttons) closes.
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.classList.contains('lightbox__figure')) { dlg.close(); }
    });

    dlg.addEventListener('close', function () {
      img.removeAttribute('src');
      if (opener) { opener.focus(); }
    });

    doc.addEventListener('langchange', function () {
      if (dlg.open) { cap.textContent = caption(links[index]); }
    });
  })();

  /* ---------------------------------------------------------------
     Olive trees: quantity, total, payment details, SEPA QR code
     --------------------------------------------------------------- */
  (function oliveTrees() {
    var form = doc.querySelector('.olive-form');
    if (!form) { return; }
    var price = parseFloat(form.getAttribute('data-price')) || 140;
    var select = form.querySelector('#tree-count');
    var nameInput = form.querySelector('#tree-name');
    var totals = form.querySelectorAll('[data-total]');
    var refs = form.querySelectorAll('[data-reference]');
    var paypal = form.querySelector('[data-paypal]');
    var bank = form.querySelector('.bank');
    var canvas = doc.getElementById('epc-qr');
    var count = 1, total = price;

    function money(n) {
      var s = String(Math.round(n));
      var l = getLang();
      return l === 'de' ? s + ' €' : l === 'zh' ? s + ' 欧元' : '€' + s;
    }
    function sepaText(str) {
      // SEPA remittance allows a-z A-Z 0-9 / - ? : ( ) . , ' + and space
      var map = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'Ä': 'Ae', 'Ö': 'Oe', 'Ü': 'Ue', 'ß': 'ss', 'ø': 'oe', 'Ø': 'Oe', 'æ': 'ae', 'Æ': 'Ae', 'œ': 'oe', 'Œ': 'Oe', 'ł': 'l', 'Ł': 'L', 'ð': 'd', 'Ð': 'D', 'þ': 'th', 'Þ': 'Th', '&': ' and ' };
      var out = str.replace(/[äöüÄÖÜßøØæÆœŒłŁðÐþÞ&]/g, function (c) { return map[c]; });
      if (out.normalize) { out = out.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
      return out.replace(/[^A-Za-z0-9 \/\-?:().,'+]/g, '').replace(/\s+/g, ' ').trim();
    }
    function reference() {
      var n = nameInput ? sepaText(nameInput.value) : '';
      if (!/[A-Za-z0-9]/.test(n.replace(/\band\b/g, ''))) { n = ''; } // e.g. a name in Chinese characters only
      return ('Olive tree' + (count > 1 ? 's' : '') + ' for Lingling and Max' + (n ? ' - ' + n : '')).slice(0, 140);
    }
    function drawQr() {
      if (!canvas || !window.LMQR || !bank || !canvas.getContext) { return; }
      var iban = (bank.getAttribute('data-iban') || '').replace(/\s+/g, '').toUpperCase();
      var bic = (bank.getAttribute('data-bic') || '').replace(/\s+/g, '').toUpperCase();
      var holder = bank.getAttribute('data-holder') || 'Maximilian Jaeger';
      // EPC069-12 "SEPA credit transfer" payload (GiroCode), version 002, UTF-8
      var payload = ['BCD', '002', '1', 'SCT', bic, holder, iban, 'EUR' + total.toFixed(2), '', '', reference()].join('\n');
      var qr;
      try { qr = window.LMQR.encode(payload); } catch (e) { return; }
      var quiet = 4, dpr = window.devicePixelRatio || 1;
      var scale = Math.max(2, Math.ceil(176 * dpr / (qr.size + quiet * 2)));
      var dim = (qr.size + quiet * 2) * scale;
      canvas.width = dim;
      canvas.height = dim;
      canvas.style.width = canvas.style.height = (dim / dpr) + 'px';
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, dim, dim);
      ctx.fillStyle = '#2f3b27';
      for (var y = 0; y < qr.size; y++) {
        for (var x = 0; x < qr.size; x++) {
          if (qr.get(x, y)) { ctx.fillRect((x + quiet) * scale, (y + quiet) * scale, scale, scale); }
        }
      }
    }
    function update() {
      count = parseInt(select.value, 10) || 1;
      total = count * price;
      Array.prototype.forEach.call(totals, function (el) { el.textContent = money(total); });
      var per = form.querySelector('[data-per-tree]');
      if (per) { per.hidden = count === 1; }
      Array.prototype.forEach.call(refs, function (el) { el.textContent = reference(); });
      if (paypal) {
        paypal.href = paypal.getAttribute('data-paypal').replace(/\/+$/, '') + '/' + total + 'EUR';
      }
      drawQr();
    }
    select.addEventListener('change', update);
    if (nameInput) { nameInput.addEventListener('input', update); }
    Array.prototype.forEach.call(form.querySelectorAll('[data-step]'), function (btn) {
      btn.addEventListener('click', function () {
        var i = select.selectedIndex + parseInt(btn.getAttribute('data-step'), 10);
        if (i >= 0 && i < select.options.length) { select.selectedIndex = i; update(); }
      });
    });
    Array.prototype.forEach.call(form.querySelectorAll('[data-copy]'), function (btn) {
      btn.addEventListener('click', function () {
        var target = form.querySelector('[data-copy-value="' + btn.getAttribute('data-copy') + '"]');
        var status = form.querySelector('[data-copy-status]');
        var MSG = { copied: { en: 'Copied', de: 'Kopiert', zh: '已复制' }, selected: { en: 'Text selected, press Ctrl or Cmd and C to copy', de: 'Text markiert, mit Strg oder Cmd und C kopieren', zh: '文本已选中，请按 Ctrl 或 Cmd 加 C 复制' } };
        function say(key) { if (status) { status.textContent = ''; setTimeout(function () { status.textContent = MSG[key][getLang()]; }, 50); } }
        if (!target) { return; }
        if (!navigator.clipboard) { var r0 = doc.createRange(); r0.selectNodeContents(target); var s0 = window.getSelection(); s0.removeAllRanges(); s0.addRange(r0); say('selected'); return; }
        navigator.clipboard.writeText(target.textContent.trim()).then(function () {
          var label = btn.querySelector('.copy__label'), done = btn.querySelector('.copy__done');
          if (!label || !done) { return; }
          label.hidden = true; done.hidden = false; say('copied');
          setTimeout(function () { label.hidden = false; done.hidden = true; }, 1600);
        }).catch(function () {
          say('selected');
          // Clipboard blocked: select the text so the guest can copy it by hand.
          var range = doc.createRange(); range.selectNodeContents(target);
          var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        });
      });
    });
    doc.addEventListener('langchange', update);
    update();
  })();

  /* ---------------------------------------------------------------
     Forms: show that a submission is on its way, prevent double sends
     --------------------------------------------------------------- */
  (function submitFeedback() {
    Array.prototype.forEach.call(doc.querySelectorAll('form[data-netlify]'), function (form) {
      var btn = form.querySelector('button[type="submit"]');
      var label = btn && btn.querySelector('.btn__label'), busy = btn && btn.querySelector('.btn__busy');
      function reset() { if (!btn) { return; } btn.disabled = false; btn.removeAttribute('aria-busy'); if (label && busy) { label.hidden = false; busy.hidden = true; } }
      form.addEventListener('submit', function () {
        if (form.checkValidity && !form.checkValidity()) { return; }
        if (!btn || btn.getAttribute('aria-busy') === 'true') { return; }
        btn.setAttribute('aria-busy', 'true');
        if (label && busy) { label.hidden = true; busy.hidden = false; }
        setTimeout(function () { btn.disabled = true; }, 0);
        setTimeout(reset, 15000); // network failed or the guest came back: let them try again
      });
      window.addEventListener('pageshow', reset);
    });

    // RSVP: a decline must not submit the attendance details hidden by CSS
    var rsvp = doc.querySelector('form[name="rsvp"]');
    if (rsvp) {
      var no = rsvp.querySelector('#rsvp-no');
      function syncAttending() {
        var off = !!(no && no.checked);
        Array.prototype.forEach.call(rsvp.querySelectorAll('.form__row--attending input, .form__row--attending select, .form__row--attending textarea'), function (el) { el.disabled = off; });
      }
      Array.prototype.forEach.call(rsvp.querySelectorAll('input[name="attending"]'), function (r) { r.addEventListener('change', syncAttending); });
      syncAttending();
    }
  })();

  /* ---------------------------------------------------------------
     Hero entrance animation: settle it no matter what after 1.6 s
     --------------------------------------------------------------- */
  (function settleHero() {
    var hero = doc.querySelector('.hero');
    if (!hero) { return; }
    setTimeout(function () { hero.classList.add('is-settled'); }, 1600);
  })();

  /* ---------------------------------------------------------------
     Sticky nav: shadow when scrolled, highlight the current section
     --------------------------------------------------------------- */
  (function nav() {
    var header = doc.querySelector('.site-header');
    var navEl = doc.querySelector('.site-nav');
    var links = Array.prototype.slice.call(doc.querySelectorAll('.site-nav__list a[href^="#"]'));
    if (!header) { return; }

    var ticking = false;
    function onScroll() {
      if (ticking) { return; }
      ticking = true;
      requestAnimationFrame(function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!('IntersectionObserver' in window) || !links.length) { return; }

    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var sections = Object.keys(byId).map(function (id) { return doc.getElementById(id); }).filter(Boolean);

    var current = null;
    function setCurrent(id) {
      if (current === id) { return; }
      current = id;
      links.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + id;
        if (on) { a.setAttribute('aria-current', 'location'); } else { a.removeAttribute('aria-current'); }
      });
      // Keep the active link visible in the horizontally scrolling nav on small screens.
      var active = byId[id];
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (navEl && navEl.scrollWidth > navEl.clientWidth) {
        var left = active ? active.offsetLeft - (navEl.clientWidth - active.offsetWidth) / 2 : 0;
        navEl.scrollTo({ left: left, behavior: reduce ? 'auto' : 'smooth' });
      }
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { setCurrent(entry.target.id); }
      });
    }, { rootMargin: '-35% 0px -60% 0px', threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });

    // Nothing highlighted while the hero is in view.
    var hero = doc.querySelector('.hero');
    if (hero) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { setCurrent(null); }
      }, { rootMargin: '-35% 0px -60% 0px' }).observe(hero);
    }
  })();
})();
