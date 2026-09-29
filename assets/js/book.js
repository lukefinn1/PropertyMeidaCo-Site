/* Booking page: embeds the Acuity Scheduling calendar.
   ------------------------------------------------------------------
   ACUITY_OWNER  – your Acuity account number (from your scheduling link).
   SERVICE_IDS   – paste each service's Acuity ID here so the website's
                   "Book Signature" etc. buttons open that service directly.
                   Find it in Acuity: open the service > "Direct link" – the
                   number after appointmentType= is the ID.
   ------------------------------------------------------------------ */
var ACUITY_OWNER = '40512109';
var SERVICE_IDS = {
  essentials: '',
  signature: '',
  prestige: '',
  photo20: '',
  photo: '',
  dronesingle: '',
  video: '',
  reelsingle: '',
  fpsingle: ''
};
var NAMES = {
  essentials: 'Essentials', signature: 'Signature', prestige: 'Prestige',
  photo20: 'Photos, up to 20', photo: 'Photos, unlimited', dronesingle: 'Drone photos',
  video: 'Listing video', reelsingle: 'Vertical social reel', fpsingle: '2D floor plan'
};

(function () {
  var slot = document.getElementById('acuity-slot');
  if (!slot) return;
  var params = new URLSearchParams(location.search);
  var pkg = params.get('package');
  var id = pkg && SERVICE_IDS[pkg];

  var src = 'https://app.acuityscheduling.com/schedule.php?owner=' + ACUITY_OWNER + '&ref=embedded_csp';
  if (id) src += '&appointmentType=' + encodeURIComponent(id);

  // If we know the package but not its Acuity ID yet, tell the visitor which one to pick
  if (pkg && NAMES[pkg] && !id) {
    var picked = document.getElementById('picked');
    picked.textContent = 'You chose ' + NAMES[pkg] + '. Select it below to see available times.';
    picked.hidden = false;
  }

  var direct = document.getElementById('acuity-direct');
  if (direct) direct.href = src.replace('&ref=embedded_csp', '');

  var frame = document.createElement('iframe');
  frame.src = src;
  frame.title = 'Book a shoot with Property Media Co';
  frame.width = '100%';
  frame.height = '900';
  frame.setAttribute('frameborder', '0');
  frame.setAttribute('allow', 'payment');
  frame.className = 'acuity-frame';
  slot.appendChild(frame);

  // Acuity's helper script resizes the iframe to fit its content
  var s = document.createElement('script');
  s.src = 'https://embed.acuityscheduling.com/js/embed.js';
  s.async = true;
  document.body.appendChild(s);

  if (typeof window.gtag === 'function') window.gtag('event', 'booking_page_view', { package: pkg || 'none' });
})();
