/* Runs before first paint (loaded synchronously in <head>).
   1. Marks the page as JS-enabled so animation start states only apply with JS.
   2. Safety net: if main.js fails to load, the hero still becomes visible. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  setTimeout(function () { root.classList.add('hero-ready'); }, 2400);
})();
