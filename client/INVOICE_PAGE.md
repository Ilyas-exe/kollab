Invoice Detail Page (frontend-only)

Location
- Route: `/invoices`
- Component: `client/src/pages/InvoiceDetailPage.jsx`

Features
- Light-mode design system: large white space, subtle shadows, rounded cards.
- KPI cards at top, filters (status, date range), search, page-size selector.
- Client-side CSV export of filtered results (button "Exporter").
- Pagination handled client-side.

Integration
1. Start the client app (docker or locally):

   ```bash
   # from repository root
   cd client
   npm install
   npm run dev
   ```

2. Sign in to the app and open: `http://localhost:3000/invoices` (or your Vite dev URL).

Notes
- This is a front-end only implementation using sample data. Replace `sampleInvoices` with an API call to fetch real invoices and add `loading` / `error` states for production.
- Export CSV uses browser blob download and includes the currently filtered rows.
