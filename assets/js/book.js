/* Booking form for Property Media Co
   ------------------------------------------------------------------
   HOW BOOKINGS REACH YOU
   1. Create a free form at https://formspree.io (sign up with luke@propertymediaco.com).
   2. Copy your form's endpoint, e.g. https://formspree.io/f/abcdwxyz
   3. Paste it into FORM_ENDPOINT below (and nothing else needs to change).
   Until then, submitting opens the agent's email app with the order filled in,
   addressed to BOOKING_EMAIL, so no booking is ever lost.
   ------------------------------------------------------------------ */
var FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
var BOOKING_EMAIL = 'luke@propertymediaco.com';

/* Prices (GST included). Keep these in sync with index.html.
   Drone and staging are one flat price per shoot, set by property size. */
var PACKAGES = [
  { id: 'small', name: '1–2 bedrooms', price: 249, desc: 'Unlimited photos and a 2D floor plan. Units, apartments and smaller homes', addon: { drone: 49, staging: 49 } },
  { id: 'medium', name: '3–4 bedrooms', price: 319, desc: 'Unlimited photos and a 2D floor plan. Most family homes', addon: { drone: 59, staging: 79 }, popular: true },
  { id: 'large', name: '5+ bedrooms', price: 419, desc: 'Unlimited photos and a 2D floor plan. Larger homes and estates', addon: { drone: 79, staging: 109 } }
];
var ADDONS = [
  { id: 'drone', name: 'Drone photos' },
  { id: 'staging', name: 'Virtual staging and furniture removal (living areas and bedrooms)' },
  { id: 'travel', name: 'Outside Cairns (Port Douglas, Tablelands, Mission Beach)', price: 75 }
];
var UNSURE = { id: 'unsure', name: 'Not sure yet', price: 0, addon: {} };

/* Price of an add-on for the chosen size (null = depends on size, not chosen yet) */
function addonPrice(a, pkg) {
  if (a.price != null) return a.price;
  return pkg.addon[a.id] != null ? pkg.addon[a.id] : null;
}

(function () {
  var form = document.getElementById('order');
  if (!form) return;

  var fmt = function (n) { return '$' + n.toLocaleString('en-AU'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var tick = '<span class="box" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>';

  // Build size and add-on options
  document.getElementById('packages').innerHTML = PACKAGES.map(function (p) {
    return '<label class="opt' + (p.popular ? ' popular' : '') + '"><input type="radio" name="package" value="' + p.id + '">' +
      '<span class="opt-top"><span class="opt-name">' + esc(p.name) + '</span><span class="opt-price">' + fmt(p.price) + '</span></span>' +
      '<span class="opt-desc">' + esc(p.desc) + '</span></label>';
  }).join('');
  document.getElementById('addons').innerHTML = ADDONS.map(function (a) {
    return '<label class="chk" data-addon="' + a.id + '"><input type="checkbox" name="addon" value="' + a.id + '">' + tick +
      '<span class="chk-name">' + esc(a.name) + '</span><span class="chk-price"></span></label>';
  }).join('');

  // Preselect from ?package=
  var params = new URLSearchParams(location.search);
  var want = params.get('package');
  var all = PACKAGES.concat([UNSURE]);
  var start = all.some(function (p) { return p.id === want; }) ? want : 'medium';
  form.querySelector('input[name="package"][value="' + start + '"]').checked = true;

  // Dates: earliest is tomorrow
  var tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  var iso = tomorrow.getFullYear() + '-' + String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + String(tomorrow.getDate()).padStart(2, '0');
  document.getElementById('date').min = iso;
  document.getElementById('backup').min = iso;

  function current() {
    var id = (form.querySelector('input[name="package"]:checked') || {}).value;
    return all.filter(function (p) { return p.id === id; })[0] || PACKAGES[1];
  }

  function niceDate(v) {
    if (!v) return '';
    var d = new Date(v + 'T00:00:00');
    return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  function update() {
    var pkg = current();
    var lines = [];
    var total = pkg.price;

    ADDONS.forEach(function (a) {
      var label = form.querySelector('[data-addon="' + a.id + '"]');
      var input = label.querySelector('input');
      var price = addonPrice(a, pkg);
      label.querySelector('.chk-price').textContent = price == null ? 'By size' : '+' + fmt(price);
      if (input.checked) { lines.push({ name: a.name, price: price }); total += price || 0; }
    });

    // Access-dependent fields
    var access = form.querySelector('input[name="access"]:checked').value;
    form.querySelectorAll('[data-access]').forEach(function (el) { el.hidden = el.getAttribute('data-access') !== access; });

    // Summary
    document.getElementById('sum-name').textContent = pkg.name;
    document.getElementById('sum-price').textContent = pkg.id === 'unsure' ? 'To confirm' : fmt(pkg.price);
    document.getElementById('sum-lines').innerHTML = lines.map(function (a) {
      return '<div class="sum-line"><span>' + esc(a.name) + '</span><span>' + (a.price == null ? 'By size' : '+' + fmt(a.price)) + '</span></div>';
    }).join('');
    var date = document.getElementById('date').value;
    document.getElementById('sum-when').textContent = date ? niceDate(date) + ', ' + document.getElementById('time').value : 'No date picked yet';
    document.getElementById('sum-access').textContent = 'Access: ' + access.toLowerCase();
    var totalText = pkg.id === 'unsure' ? 'TBC' : fmt(total);
    document.getElementById('sum-total').textContent = totalText;
    var bar = document.getElementById('bar-total');
    if (bar) { bar.textContent = totalText; document.getElementById('bar-name').textContent = pkg.name; }

    return { pkg: pkg, lines: lines, total: total, access: access, date: date, time: document.getElementById('time').value };
  }

  form.addEventListener('change', update);
  form.addEventListener('input', function (e) { if (e.target.type === 'date') update(); });
  update();

  function summaryText(o) {
    var get = function (n) { var el = form.elements[n]; return el && el.value ? el.value : ''; };
    var out = [
      'Package: ' + o.pkg.name + (o.pkg.price ? ' (' + fmt(o.pkg.price) + ')' : ''),
      'Add-ons: ' + (o.lines.length ? o.lines.map(function (a) { return a.name + (a.price == null ? ' (price by size)' : ' (+' + fmt(a.price) + ')'); }).join(', ') : 'None'),
      'Total (incl. GST): ' + (o.pkg.id === 'unsure' ? 'To confirm' : fmt(o.total)),
      '',
      'Address: ' + get('address'),
      'Property: ' + get('property_type') + ', ' + get('occupancy'),
      'Access: ' + o.access
    ];
    if (o.access === 'Key box') out.push('Key box code: ' + get('keybox_code'), 'Key box location: ' + get('keybox_location'));
    if (o.access === 'Meet someone on site') out.push('On-site contact: ' + get('onsite_contact') + ' ' + get('onsite_mobile'));
    if (o.access === 'Tenant or vendor home') out.push('Occupant: ' + get('occupant_name') + ' ' + get('occupant_mobile'));
    if (o.access === 'Collect keys from office') out.push('Office: ' + get('office_details'));
    out.push('Notes: ' + (get('notes') || '-'), '',
      'Preferred: ' + niceDate(o.date) + ', ' + o.time,
      'Backup date: ' + (niceDate(get('backup_date')) || '-'), '',
      'Name: ' + get('name'), 'Agency: ' + (get('agency') || '-'), 'Mobile: ' + get('mobile'), 'Email: ' + get('email'));
    return out.join('\n');
  }

  // Hide the sticky mobile bar while the full order summary is on screen
  var mobileBar = document.getElementById('mobile-bar');
  var summaryEl = document.querySelector('.summary');
  if (mobileBar && summaryEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      mobileBar.classList.toggle('away', entries[0].isIntersecting);
    }).observe(summaryEl);
  }

  var errorEl = document.getElementById('form-error');
  var submitBtn = document.getElementById('submit');

  function showError(msg) { errorEl.textContent = msg; errorEl.hidden = false; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorEl.hidden = true;

    var firstInvalid = Array.prototype.filter.call(form.querySelectorAll('[required]'), function (el) { return !el.checkValidity(); })[0];
    if (firstInvalid) {
      showError('Please fill in the highlighted details: address, preferred date, name, mobile and a valid email.');
      firstInvalid.focus();
      firstInvalid.reportValidity && firstInvalid.reportValidity();
      return;
    }

    var o = update();
    var text = summaryText(o);
    document.getElementById('order-summary').value = text;
    document.getElementById('order-total').value = o.pkg.id === 'unsure' ? 'To confirm' : fmt(o.total);
    document.getElementById('subject').value = 'Booking request: ' + o.pkg.name + ', ' + form.elements.address.value;

    try { document.dispatchEvent(new CustomEvent('booking:submitted', { detail: { package: o.pkg.id, value: o.pkg.id === 'unsure' ? 0 : o.total } })); } catch (err) {}

    var done = function () {
      document.getElementById('done-line').textContent = o.pkg.name + (o.pkg.id === 'unsure' ? '' : ', ' + fmt(o.total) + ' incl. GST') + '. Preferred ' + niceDate(o.date) + ', ' + o.time + '.';
      form.hidden = true;
      var mb = document.getElementById('mobile-bar'); if (mb) mb.hidden = true;
      var d = document.getElementById('done'); d.hidden = false;
      d.querySelector('.done').focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Not connected to Formspree yet: fall back to the agent's email app
    if (FORM_ENDPOINT.indexOf('YOUR_FORM_ID') !== -1) {
      location.href = 'mailto:' + BOOKING_EMAIL +
        '?subject=' + encodeURIComponent(document.getElementById('subject').value) +
        '&body=' + encodeURIComponent(text);
      done();
      return;
    }

    submitBtn.disabled = true; submitBtn.textContent = 'Sending…';
    fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('bad'); done(); })
      .catch(function () {
        showError('Sorry, that didn’t send. Please try again, or email ' + BOOKING_EMAIL + '.');
      })
      .then(function () { submitBtn.disabled = false; submitBtn.textContent = 'Request booking'; });
  });
})();
