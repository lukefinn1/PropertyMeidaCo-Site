# Property Media Co website

Live site: https://propertymediaco.com (hosted on GitHub Pages from the `main` branch).

## Files
- `index.html` – landing page
- `book.html` – booking form
- `assets/css/styles.css` – site styles (desktop, laptop, tablet and mobile layouts)
- `assets/css/book.css` – booking page styles
- `assets/js/main.js` – mobile menu
- `assets/js/book.js` – booking form logic, prices and where bookings are sent
- `assets/img/` – compressed photos
- `CNAME` – custom domain for GitHub Pages

## Updating prices
Prices appear in `index.html` (the three size cards **and** the mobile comparison table) and in the `PACKAGES` and `ADDONS` lists at the top of `assets/js/book.js`. Change all three.

## Booking emails
Bookings are sent with Formspree. Put your form endpoint in `FORM_ENDPOINT` at the top of `assets/js/book.js`. Until then, the form opens the visitor's email app addressed to luke@propertymediaco.com.
