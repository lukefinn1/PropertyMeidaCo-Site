// Mobile / tablet menu toggle
(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  var label = toggle.querySelector('.menu-label');

  function setOpen(open) {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (label) label.textContent = open ? 'Close' : 'Menu';
  }

  toggle.addEventListener('click', function () {
    setOpen(!document.body.classList.contains('nav-open'));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024) setOpen(false);
  });
})();

// Singles / add-ons tabs (mobile only; both lists show side by side on larger screens)
(function () {
  var tabs = document.querySelectorAll('.tabs [role="tab"]');
  if (!tabs.length) return;
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        document.getElementById(t.getAttribute('aria-controls')).classList.toggle('is-hidden', !on);
      });
    });
  });
})();

// Sticky header and mobile Book button appear once the hero has scrolled away
(function () {
  var hero = document.querySelector('.hero');
  var bar = document.getElementById('sticky-bar');
  var fab = document.getElementById('book-fab');
  var finalCta = document.querySelector('.final');
  if (!hero || !('IntersectionObserver' in window)) return;
  var pastHero = false, atEnd = false;
  function apply() {
    if (bar) {
      bar.classList.toggle('show', pastHero);
      bar.setAttribute('aria-hidden', pastHero ? 'false' : 'true');
      bar.querySelectorAll('a').forEach(function (a) { a.tabIndex = pastHero ? 0 : -1; });
    }
    if (fab) fab.classList.toggle('show', pastHero && !atEnd);
  }
  new IntersectionObserver(function (e) { pastHero = !e[0].isIntersecting; apply(); }, { rootMargin: '-90px 0px 0px 0px', threshold: 0 }).observe(hero);
  if (finalCta) new IntersectionObserver(function (e) { atEnd = e[0].isIntersecting; apply(); }).observe(finalCta);
})();
