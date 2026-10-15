# CARS24 Listing Performance Dashboard

Responsive static dashboard comparing featured and non-featured listings. Built with HTML, CSS, vanilla JavaScript, Chart.js and a Google Apps Script JSON endpoint. No application server or build step is required.

## Files

- index.html: dashboard structure
- css/style.css: responsive design tokens and components
- js/config.js: endpoint URL and refresh interval
- js/dashboard.js: API loading, normalization, filters and summaries
- js/charts.js: reusable Chart.js renderers
- apps-script/Code.gs: read-only Sheets JSON API
- assets/: future static assets

## Google Sheets setup

Create a tab (default Data) with a header row. Recommended columns:

date | city | listingType | listings | views | leads

Use Featured or Non-featured for listingType. A row may represent one listing-day or an aggregated group. The API also accepts featured / isFeatured instead of listingType, impressions instead of views, and enquiries instead of leads. Use valid dates (ISO YYYY-MM-DD recommended) and numeric metric values.

1. Open Google Apps Script and create a project.
2. Copy apps-script/Code.gs into the editor and save.
3. In Project Settings → Script Properties, add SHEET_ID (the ID between /d/ and /edit in the spreadsheet URL). Optionally set SHEET_NAME; it defaults to Data.
4. Run doGet once and grant spreadsheet access.
5. Choose Deploy → New deployment → Web app. Select Execute as: Me and Who has access: Anyone, then deploy.
6. Copy the Web app URL ending in /exec.
7. Set apiUrl in js/config.js to that URL. The dashboard loads on open, manual refresh and every five minutes.

The deployed endpoint is public to anyone who can access its URL. Do not expose personal or sensitive data in the published sheet.

## GitHub setup

Source repository: https://github.com/kunalbhatia-C24/live-dashboard. Keep files at the repository root; main is the default branch. Pushes to the connected branch can trigger Cloudflare deployments.

## Cloudflare Pages deployment

1. In Cloudflare, open Workers & Pages → Create application → Pages → Connect to Git.
2. Select kunalbhatia-C24/live-dashboard and authorize access if prompted.
3. Set production branch to main.
4. Leave Build command blank and set Build output directory to / (repository root).
5. Save and deploy. Later pushes to main trigger deployment.
6. Open the Pages URL and check the API URL, Web App access, sheet ID/name and headers if the dashboard has no data.

## Data behavior

- City and date filters recalculate all KPIs, charts and the table.
- CTR is leads divided by views; zero views gives 0%.
- Update field aliases in js/dashboard.js normalize() if your sheet headers differ.
- CSS variables, chart helpers and data normalization are reusable for future dashboard views.
- Chart.js and fonts load from public CDNs, so visitors need network access to those services.

## Local preview

Serve index.html through a local static server (such as VS Code Live Server). Browsers may block cross-origin API calls from file URLs; Cloudflare Pages is the intended origin.
