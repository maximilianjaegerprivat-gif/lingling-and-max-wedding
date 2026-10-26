/* Runs before first paint: marks JavaScript as available and restores the saved language. */
(function () {
  var root = document.documentElement;
  root.className = root.className.replace(/\bno-js\b/, 'js');
  try {
    var saved = localStorage.getItem('lm-lang');
    if (saved === 'de' || saved === 'en' || saved === 'zh') {
      root.setAttribute('data-lang', saved);
      root.lang = saved;
    }
  } catch (e) { /* storage blocked: stay in English */ }
})();
