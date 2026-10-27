/* Runs before first paint: marks JavaScript as available and restores the saved language. */
(function () {
  var root = document.documentElement;
  root.className = root.className.replace(/\bno-js\b/, 'js');
  var lang = null;
  try {
    // ?lang=de / ?lang=zh in the link wins, then the remembered choice
    var m = /[?&]lang=(en|de|zh)\b/.exec(location.search);
    if (m) { lang = m[1]; try { localStorage.setItem('lm-lang', lang); } catch (e2) { /* ignore */ } }
    else { var saved = localStorage.getItem('lm-lang'); if (saved === 'de' || saved === 'en' || saved === 'zh') { lang = saved; } }
  } catch (e) { /* storage blocked: stay in English */ }
  if (lang) {
    root.setAttribute('data-lang', lang);
    root.lang = lang === 'zh' ? 'zh-Hans' : lang;
  }
})();
