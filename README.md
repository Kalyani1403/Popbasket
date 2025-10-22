# PopBasket — E-Commerce Demo

PopBasket is a small React + TypeScript e-commerce demo (Vite) with a simple Express + Mongoose backend for persistence. This README explains how to set up the project, run the frontend and backend locally, configure MongoDB Atlas, and verify key features (including login -> redirect to product behavior).

---

## What changed / important notes
- Branding updated to "PopBasket" across the UI and metadata.
- All visible price displays were switched from `$` to the rupee symbol `₹`.
- Backend added under `server/` (Express + Mongoose). A `.env` file in the project root is used to provide `MONGODB_URI` and `PORT`.
- Dev server scripts changed to use `ts-node/register` so TypeScript server code runs directly in development.
- Clicking a product while logged out now saves the requested product and redirects users to the login page; after successful login/signup the app automatically shows the product detail.

---

## Prerequisites
- Node.js (>= 18 recommended)
- npm (comes with Node.js)
- A MongoDB Atlas cluster (or other MongoDB instance).

---

## Files added/important locations
- `server/` — backend server code (Express, Mongoose)
  - `server/db.ts` — mongoose connection logic
  - `server/server.ts` — Express app and simple API routes
  - `server/models/` — Mongoose models (Product, User, Order)
- `components/` — React UI components (frontend)
- `constants.ts` — seed products and test users (test emails: `admin@popbasket.com`, `user@popbasket.com`)

---

## Environment variables
Create a `.env` file in the project root (don't commit it). Example:

```
MONGODB_URI=mongodb+srv://<db_user>:<password>@cluster0.xhjv4w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
```

If you need an AI key (project contains an optional Gemini service file), put it in `.env.local` as `GEMINI_API_KEY=...` (this is optional and not required for the core app).

---

## Install dependencies
Open a terminal (Windows cmd) in the project root and run:

```cmd
npm install
```

This installs frontend and backend dependencies declared in `package.json`.

---

## Running the app in development

Start the frontend (Vite dev server):

```cmd
npm run dev
```

Start the backend (nodemon + ts-node, watches `server/`):

```cmd
npm run dev:server
```

If you prefer to run the backend once (no nodemon):

```cmd
npx ts-node --require dotenv/config server/server.ts
```

Notes:
- Backend listens on the port from `.env` (defaults to 5000).
- The server will connect to MongoDB using `MONGODB_URI` from `.env`.

---

## MongoDB Atlas troubleshooting
If the server prints a message like "Could not connect to any servers in your MongoDB Atlas cluster", try the following:

1. Verify `MONGODB_URI` is correct and the username/password are valid.
2. In MongoDB Atlas, go to Network Access and add your current IP address (or `0.0.0.0/0` for quick testing). Your IP can change when on VPN. After adding your IP, retry the server.
3. If your password contains special characters (such as `@`, `:` or `/`), URL-encode them in the connection string.

---

## Test accounts
The project includes seed users in `constants.ts` for testing frontend authentication (this is purely client-side for the demo):

- Admin: `admin@popbasket.com` / `adminpassword`
- User: `user@popbasket.com` / `userpassword`

---

## Verifying the login -> redirect behavior
1. Run both frontend and backend.
2. Visit the site (Vite usually opens at `http://localhost:5173` by default).
3. Click a product while not signed in. You should be redirected to the login page.
4. Sign in using `user@popbasket.com` / `userpassword`.
5. After successful login, the app will automatically display the product you originally clicked.

---

## API endpoints (basic)
- GET `/api/products` — list products
- GET `/api/products/:id` — product details
- POST `/api/users/register` — register user (demo)
- POST `/api/orders` — create order
- GET `/api/orders/:userId` — list user orders

These are simple demo routes defined in `server/server.ts` for a minimal backend. They can be extended as needed.

---

## Recommended next steps / improvements


## Troubleshooting & common commands

If you hit issues, copy the server output and check the `.env` settings and your Atlas network access.


If you want, I can:

When you build this project for production you can serve it from the site root (`/`) or from a subpath (for example GitHub Pages). Use the `VITE_BASE` environment variable to set the base path before running the build.

Windows cmd (build for `/my-app/`):
```cmd
set VITE_BASE=/my-app/
npm run build
```

PowerShell:
```powershell
$env:VITE_BASE = '/my-app/'; npm run build
```

The build output will be placed in the `dist/` folder. Images are bundled or copied into `public/img/` by project scripts so they will be included in the final build.

For GitHub Pages, set `VITE_BASE` to `/your-repo-name/` and publish the contents of `dist/` to the `gh-pages` branch or use a GitHub Action for deployment.

- Add a small health-check route that returns DB connection status.
- Implement server-side authentication (hashing + JWT) and connect the frontend to real login/register API routes.
- Add currency formatting and locale options.

Tell me which next step you'd like me to implement and I'll proceed.



"# Ecommerce_website" 
"# PopBasketApp" 
