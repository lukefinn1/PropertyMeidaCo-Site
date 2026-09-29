// Google Analytics 4 — click tracking for the actions that matter.
// Events appear in GA under Reports > Engagement > Events.
(function () {
  function send(name, params) { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a, button');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var label = (a.getAttribute('aria-label') || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
    var where = (a.closest('[data-sec]') || a.closest('header') || {}).dataset ? ((a.closest('[data-sec]') || {}).dataset || {}).sec || (a.closest('.sticky-bar') ? 'sticky_header' : a.closest('.book-fab') ? 'mobile_button' : 'header') : '';

    if (href.indexOf('book.html') !== -1) {
      var m = href.match(/package=([a-z0-9]+)/);
      send('book_click', { package: m ? m[1] : 'none', button: label, location: where || (a.id === 'book-fab' ? 'mobile_button' : 'page') });
    } else if (href.indexOf('mailto:') === 0) {
      send('email_click', { location: where });
    } else if (href.indexOf('tel:') === 0) {
      send('phone_click', { location: where });
    } else if (href.indexOf('instagram.com') !== -1) {
      send('instagram_click', { location: where });
    }
  });

  // Booking form sent (fires from book.js)
  document.addEventListener('booking:submitted', function (e) {
    var d = e.detail || {};
    send('generate_lead', { package: d.package, value: d.value, currency: 'AUD' });
  });
})();
