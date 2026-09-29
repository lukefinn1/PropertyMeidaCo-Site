/* Booking page
   Step 1: our own package picker (with prices).
   Step 2: Acuity Scheduling, filtered to the chosen service so it only shows
           dates, times, add-ons and the property questions.
   ------------------------------------------------------------------
   SERVICE_IDS – paste each service's Acuity ID. In Acuity open the service >
   "Direct link"; the number after appointmentType= is the ID.
   Until an ID is filled in, step 2 shows Acuity's full service list.
   ------------------------------------------------------------------ */
var ACUITY_OWNER = '40512109';
var SERVICE_IDS = {
  essentials: '', signature: '', prestige: '',
  photo20: '', photo: '', dronesingle: '', video: '', reelsingle: '', fpsingle: ''
};

var PACKAGES = [
  { id: 'essentials', name: 'Essentials', price: 495, desc: 'Unlimited photos, 10 drone photos, floor plan' },
  { id: 'signature', name: 'Signature', price: 995, desc: 'Essentials plus a branded listing video, 4 virtual twilights and 5 rooms of virtual staging', tag: true },
  { id: 'prestige', name: 'Prestige', price: 1695, desc: 'Signature plus social reel, unlimited drone and staging, real twilight and your on-camera intro' }
];
var SINGLES = [
  { id: 'photo20', name: 'Photos (up to 20)', price: 265 },
  { id: 'photo', name: 'Photos (unlimited)', price: 329 },
  { id: 'dronesingle', name: 'Drone photos', price: 199 },
  { id: 'video', name: 'Listing video', price: 549 },
  { id: 'reelsingle', name: 'Social reel', price: 299 },
  { id: 'fpsingle', name: 'Floor plan', price: 149 }
];

(function () {
  var slot = document.getElementById('acuity-slot');
  if (!slot) return;
  var fmt = function (n) { return '$' + n.toLocaleString('en-AU'); };
  var all = PACKAGES.concat(SINGLES);

  document.getElementById('packages').innerHTML = PACKAGES.map(function (p) {
    return '<label class="opt' + (p.tag ? ' popular' : '') + '"><input type="radio" name="service" value="' + p.id + '">' +
      '<span class="opt-top"><span class="opt-name">' + p.name + '</span><span class="opt-price">' + fmt(p.price) + '</span></span>' +
      '<span class="opt-desc">' + p.desc + '</span></label>';
  }).join('');
  document.getElementById('singles').innerHTML = SINGLES.map(function (p) {
    return '<label class="opt sm"><input type="radio" name="service" value="' + p.id + '">' +
      '<span class="opt-name">' + p.name + '</span><span class="opt-price-sm">' + fmt(p.price) + '</span></label>';
  }).join('');

  var frame = null, loadedFor = null;
  function load(id) {
    var svc = all.filter(function (p) { return p.id === id; })[0];
    var typeId = svc && SERVICE_IDS[svc.id];
    var src = 'https://app.acuityscheduling.com/schedule.php?owner=' + ACUITY_OWNER + '&ref=embedded_csp';
    if (typeId) src += '&appointmentType=' + encodeURIComponent(typeId);
    document.getElementById('step2-title').textContent = svc ? 'Pick a date and time for ' + svc.name : 'Pick a date and time';
    var picked = document.getElementById('picked');
    if (svc && !typeId) { picked.textContent = 'Select ' + svc.name + ' (' + fmt(svc.price) + ') below to see available times.'; picked.hidden = false; }
    else picked.hidden = true;
    document.getElementById('acuity-direct').href = src.replace('&ref=embedded_csp', '');
    if (typeof window.gtag === 'function' && svc) window.gtag('event', 'service_selected', { package: svc.id, value: svc.price, currency: 'AUD' });

    if (loadedFor === src) return;
    loadedFor = src;

    if (!frame) {
      frame = document.createElement('iframe');
      frame.title = 'Choose a date and time';
      frame.width = '100%'; frame.height = '820';
      frame.setAttribute('frameborder', '0'); frame.setAttribute('allow', 'payment');
      frame.className = 'acuity-frame';
      slot.appendChild(frame);
      var s = document.createElement('script');
      s.src = 'https://embed.acuityscheduling.com/js/embed.js'; s.async = true;
      document.body.appendChild(s);
    }
    frame.src = src;
  }

  document.addEventListener('change', function (e) {
    if (e.target.name !== 'service') return;
    load(e.target.value);
    if (window.innerWidth < 1024) document.getElementById('scheduler').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  var want = new URLSearchParams(location.search).get('package');
  if (want === 'single') want = 'photo';
  var start = all.some(function (p) { return p.id === want; }) ? want : 'signature';
  var input = document.querySelector('input[name="service"][value="' + start + '"]');
  if (input) input.checked = true;
  load(start);
})();
