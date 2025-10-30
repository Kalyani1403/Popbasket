# PopBasket — E-Commerce Demo

PopBasket is a small React + TypeScript e-commerce demo (Vite) with a simple Express + Mongoose backend for persistence. This README explains how to set up the project, run the frontend and backend locally, configure MongoDB Atlas, and verify key features (including login -> redirect to product behavior).

---

## What changed / important notes
- Branding updated to "PopBasket" across the UI and metadata.
# PopBasket — E‑Commerce Demo

PopBasket is a small React + TypeScript e‑commerce demo (Vite) with an Express + Mongoose backend for persistence. This README explains how to set up the project, run the frontend and backend locally, configure MongoDB, and verify core features (auth, products, cart, orders).

---

## Quick facts
- Frontend: React + TypeScript (Vite)
- Backend: Node.js + Express + TypeScript + Mongoose
- DB: MongoDB (Atlas or local)
- Dev scripts: start frontend with `npm run dev`, start backend with `npm run dev:server`

---

## Prerequisites
- Node.js 18+ (recommended)
- npm (bundled with Node.js)
- A MongoDB instance (MongoDB Atlas or local)

---

## Important files / folders
- `server/` — backend server code
  - `server/db.ts` — mongoose connection logic
  - `server/server.ts` & `server/app.ts` — Express application and routes
  - `server/models/` — Mongoose models (Product, User, Order)
  - `server/routes/` — organized API routes (auth, products, orders, users)
- `components/`, `contexts/` — frontend React UI and state
- `constants.ts` — demo/seed data and test users

---

## Environment variables
Create a `.env` file in the project root (don't commit it). Minimal example:

```text
MONGODB_URI=mongodb+srv://<db_user>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_jwt_secret_here
# Optional: GEMINI_API_KEY=...
```

Notes:
- If using MongoDB Atlas, allow your IP in Network Access (or use `0.0.0.0/0` for testing).
- URL‑encode any special characters in the password.

---

## Install dependencies
Open a Windows cmd terminal at the project root and run:

```cmd
npm install
```

This installs frontend and backend dependencies declared in `package.json`.

---

## Run (development)

1) Start the frontend (Vite dev server):

```cmd
npm run dev
```

2) Start the backend (nodemon + ts-node, watches `server/`):

```cmd
npm run dev:server
```

Alternative: run the backend once without watcher:

```cmd
npm run server
# or
npx ts-node --project server/tsconfig.json --require dotenv/config server/server.ts
```

Build & production preview:

```cmd
npm run build
npm run preview
```

The backend build step compiles the server TypeScript into `dist/` and `npm start` will run the compiled server.

---

## API (summary)
These are the main API endpoints provided by the backend. They are implemented under `server/routes/`.

- Auth
  - POST `/api/auth/register` — register a user (returns token + user)
  - POST `/api/auth/login` — login (returns token + user)

- Products
  - GET `/api/products` — list products
  - GET `/api/products/:id` — product details
  - POST `/api/products` — create product (admin)
  - PUT `/api/products/:id` — update product (admin)
  - DELETE `/api/products/:id` — delete product (admin)
  - POST `/api/products/:id/rate` — add rating/review (authenticated)

- Orders
  - POST `/api/orders` — create order (authenticated)
  - GET `/api/orders/myorders` — get current user's orders
  - GET `/api/orders` — list all orders (admin)
  - PUT `/api/orders/:id/status` — update order status (admin)

- Users
  - GET `/api/users/profile` — get profile (authenticated)
  - PUT `/api/users/profile` — update profile (authenticated)
  - POST `/api/users/wishlist/:productId` — add to wishlist
  - DELETE `/api/users/wishlist/:productId` — remove from wishlist

All authenticated routes expect an `Authorization: Bearer <token>` header with a valid JWT.

---

## Test accounts (demo)
The frontend includes demo credentials in `constants.ts` for convenience (client-side only):

- Admin: `admin@popbasket.com` / `adminpassword`
- User: `user@popbasket.com` / `userpassword`

Use these in the UI for quick manual testing. The backend has password hashing and JWT auth implemented; if you seed users directly into the DB, hash passwords or register via the API.

---

## Troubleshooting & tips
- If the server can't connect to MongoDB: check `MONGODB_URI`, Atlas Network Access (IP whitelist), and URL encoding of special characters.
- If you see TypeScript import/module errors, run a fresh `npm install` and ensure the project is opened at the repository root (tsconfig paths expect `server/` relative folder).
- Server logs are printed to the console when running `npm run dev:server`; paste errors if you need help.

Health check:
The server exposes a basic root/health endpoint (`GET /`) that returns a simple text response. Consider adding a DB connection health endpoint under `server/` if you need richer checks.

---

## Next steps / suggestions
- Add automated tests for API routes (Jest + supertest).
- Add CI workflow for linting/build/tests.
- Add image upload (Multer) and product import script.
- Add payment integration in the orders flow.

If you want, I can implement any of the above — tell me which next step you'd like and I'll proceed.
"# PopBasketApp" 
