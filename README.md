# Tiny Teens Website

A mobile-friendly storefront for **Tiny Teens** with a password-protected admin panel.

## What is included

- Public storefront with product listing and WhatsApp enquiry
- Admin panel at `/#admin`
- Password login for admin actions
- Product data stored in SQLite database (`data/store.db`)
- Image uploads stored in `public/uploads/` and referenced from DB

## Tech stack

- React 18 + Vite 5 (frontend)
- Express 4 API server
- SQLite via `better-sqlite3`
- JWT auth for admin session
- `multer` for image uploads

## Setup

1. Install dependencies
2. Create `.env` from `.env.example`
3. Set your admin password

```bash
npm install
cp .env.example .env
```

Update `.env` and change at least:

- `ADMIN_PASSWORD`
- `ADMIN_JWT_SECRET`

## Run locally (frontend + API)

```bash
npm run dev:full
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:4000`

You can also run separately:

```bash
npm run dev:api
npm run dev
```

## Admin usage

1. Open the site and click `Admin`.
2. Enter your admin password.
3. Edit product fields.
4. Optional: upload an image file for each product.
5. Click `Save Changes`.

All product updates (including new products and image URLs) are saved in DB.

## Smoke test harness

Run this while API server is running:

```bash
npm run smoke:test
```

It checks `/api/products` and prints loaded product count.

## Build frontend

```bash
npm run build
npm run preview
```

