# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Key commands

### Frontend (`valerix-frontend/`)

- Install dependencies:
  - `cd valerix-frontend && npm install`
- Start the Vite dev server:
  - `npm run dev`
- Build the production bundle:
  - `npm run build`
- Run ESLint on the frontend codebase:
  - `npm run lint`
- Preview the built app (uses the Vite preview server):
  - `npm run preview`

The frontend assumes the API is reachable at `http://localhost:5000/api` (see `src/utils/api.js`).

### Backend (`backend/`)

- Install dependencies:
  - `cd backend && npm install`
- Start the API in watch mode (nodemon, reloads on changes under `src/`):
  - `npm run dev`
- Start the API in production mode (no auto-reload):
  - `npm start`
- Run all Jest tests for the backend:
  - `npm test`
- Run a single Jest test file (once tests exist):
  - `npm test -- --runTestsByPath path/to/your.test.js`

The backend listens on `PORT` (defaults to `5000`) and exposes its HTTP API under `/api/*`.

## Runtime configuration

The backend uses `dotenv` and expects environment variables (typically via a `.env` at the repo root):

- Core app
  - `PORT` – HTTP port for the backend server (default `5000`).
  - `NODE_ENV` – standard Node environment flag.
  - `CLIENT_URL` – allowed CORS origin for the frontend (used in `src/app.js`).
- Database
  - `MONGODB_URI` – MongoDB connection string (required by `src/config/db.js`).
- Auth & logging
  - `JWT_SECRET`, `JWT_EXPIRES_IN` – JWT signing secret and expiry (see `src/config/jwt.js`).
  - `LOG_LEVEL` – log level for the Winston logger (see `src/utils/logger.js`).
- Email / OTP
  - `RESEND_API_KEY`, `EMAIL_FROM` – credentials for email sending via Resend (`src/utils/sendEmail.js`).
- AWS / S3
  - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET` – used by `src/config/aws.js` and `src/services/s3.service.js` for S3 uploads.
- Frontend / sockets
  - `VITE_SOCKET_URL` – frontend-only; base URL for the Socket.IO client (`src/hooks/useSocket.js`). Defaults to `http://localhost:5000` when unset and should match the backend server origin.

## Backend architecture (`backend/`)

The backend is a Node.js + Express + Mongoose application structured into clear layers around domain concepts (auth, users, products, cart, orders, payments, chat, delivery, etc.).

### Entry point and HTTP pipeline

- `src/server.js` is the main entry:
  - Loads environment variables.
  - Connects to MongoDB via `src/config/db.js`.
  - Calls `AuthService.ensureDefaultAdmin()` once at startup to guarantee a single admin account exists.
  - Creates an HTTP server from the Express app and attaches Socket.IO via `src/sockets/index.js`.
  - Starts listening on `PORT` and logs status via `src/utils/logger.js`.
- `src/app.js` builds the Express app:
  - Global middlewares: `helmet`, `compression`, JSON/body parsing, `cookie-parser`.
  - CORS configured with `CLIENT_URL` (falls back to `*` during development).
  - Global rate limiting via `rateLimiter.globalLimiter`.
  - `/health` endpoint exposing basic status, `NODE_ENV`, and a timestamp.
  - Mounts all REST routes under `/api/*` and wires the global `errorHandler` as the final middleware.

### Configuration and cross‑cutting concerns

- `src/config/db.js` – connects to MongoDB using `MONGODB_URI` and wires connection lifecycle logging.
- `src/config/jwt.js` – wraps JWT signing/verification and centralizes token expiry configuration.
- `src/config/aws.js` – configures the AWS SDK from environment variables.
- `src/utils/logger.js` – Winston logger used across the app, with colorized console output.
- `src/middlewares/rateLimiter.js` – defines `globalLimiter` (general traffic) and `authLimiter` (stricter limits for auth/OTP routes).
- `src/middlewares/authJwt.js` – primary JWT auth middleware:
  - Accepts tokens from the `Authorization: Bearer` header or `token` cookie.
  - Verifies with `JWT_SECRET`, loads the `User` document, and attaches a minimal `req.user` (id, role, email).
- `src/middlewares/errorHandler.js` – central error handler that standardizes JSON error responses and hides stack traces in production.

There is also an older `src/middlewares/auth.middleware.js` that performs inline JWT verification; new routes typically use `authJwt` instead.

### Domain modules (routes → controllers → services → models)

The backend follows a consistent pattern where each domain has:

- A route module under `src/routes/*.routes.js` that defines URL paths and middleware.
- A controller module under `src/controllers/*` that handles HTTP concerns (parsing input, calling services, mapping results to JSON).
- A service module under `src/services/*` that contains business logic and orchestrates models and utilities.
- One or more Mongoose models in `src/models/*` that define persistence.

Examples:

- **Auth**
  - Routes: `src/routes/auth.routes.js` exposes `/api/auth/*` endpoints for signup, login, OTP verification, and `GET /api/auth/me`.
  - Controller: `src/controllers/auth.controller.js` is thin and delegates to `AuthService`.
  - Service: `src/services/auth.service.js` implements:
    - Normal user signup (enforces no admin creation from public routes).
    - Separate startup signup flow that also creates a `Profile` document.
    - Password-based login that generates an OTP, stores a hashed OTP & expiry on the `User`, and sends the OTP via email.
    - OTP verification that marks the user verified and issues a signed JWT including `id`, `email`, and `role`.
  - Models: `User` (see `src/models/User.js`) and `Profile` define core identity and profile data, including roles (`user`, `startup`, `admin`, `delivery`) and optional default address references.

- **Commerce (products, cart, orders, payments)**
  - Routes under `src/routes/` (e.g., `product.routes.js`, `cart.routes.js`, `order.routes.js`, `payment.routes.js`) organize endpoints by concern and typically require `authJwt`.
  - Controllers delegate to services like `product.service.js`, `order.service.js`, and inventory/metrics services for business rules (stock adjustments, startup inventory views, admin dashboards, etc.).
  - Mongoose models capture entities such as `Product`, `Order`, `Cart`, `Category`, `Address`, and related documents (see `src/models/*`).

- **Startup / admin domains**
  - Specialized startup endpoints (e.g., `startup.routes.js`, `startup.inventory.routes.js`, `startup.products.routes.js`) expose views and operations from the startup owner perspective.
  - Admin routes (`admin.routes.js`) provide higher-privilege operations for managing users, products, orders, and inventory.

### Realtime and chat

- `src/sockets/index.js` creates a Socket.IO server on top of the HTTP server, with permissive CORS by default, and wires two namespaces:
  - `chat.socket.js` under the `/chat` namespace for real-time messaging.
  - `delivery.socket.js` for delivery and tracking updates.
- `src/sockets/chat.socket.js` implements the chat event flow:
  - Clients connect to `/chat` and can `joinRoom(roomId)`.
  - `sendMessage` events persist messages via `ChatService.sendMessage(...)` and broadcast `newMessage` to all clients in the room.
  - `typing` events broadcast typing indicators to other participants.

HTTP chat routes in `src/routes/chat.routes.js` complement sockets by providing REST endpoints for resolving room IDs and listing or sending messages.

### File uploads and email

- `src/services/s3.service.js` uses the configured AWS SDK to generate pre-signed S3 upload URLs and corresponding public file URLs.
- `src/utils/sendEmail.js` uses the Resend API to send transactional emails (e.g., OTP emails) based on `RESEND_API_KEY` and `EMAIL_FROM`.

## Frontend architecture (`valerix-frontend/`)

The frontend is a React 19 + Vite SPA that talks to the backend over REST and Socket.IO. It uses TailwindCSS and shadcn-style UI components, Zustand for client-side state, and axios for HTTP.

### Entrypoint and routing

- `src/main.jsx` sets up the React root and wraps `App` in a `BrowserRouter`.
- `src/App.jsx` is the central router and role-aware gatekeeper:
  - Calls `useAuthStore().initAuth()` on mount to bootstrap auth state from `localStorage` and `GET /auth/me`.
  - Implements a `RequireAuth` wrapper that shows a loading screen while auth is initializing, redirects unauthenticated users to `/auth/login`, and optionally enforces allowed roles.
  - Implements `RoleAwareHome`, used at `/`, which redirects logged-in users to `/admin`, `/startup`, or `/user` based on their role.
  - Declares route groups for each role:
    - **Auth**: `/auth/login`, `/auth/signup`, `/auth/verify-otp` within `AuthLayout`.
    - **User**: `/user/*` within `UserLayout` (home, profile, products, product details, cart, checkout, orders).
    - **Startup**: `/startup/*` within `StartupLayout` (dashboard, products, inventory, orders).
    - **Admin**: `/admin/*` within `AdminLayout` (dashboard, products, orders, users, inventory).
    - **Chat**: `/chat` and `/chat/:chatId` within `ChatLayout`, shared across user/startup/admin roles.
  - A catch-all route displays a simple 404 message.

Legacy `routes/ProtectedRoute.jsx` and `routes/RoleRoute.jsx` components also exist; the current routing logic is primarily implemented inline in `App.jsx` using `RequireAuth` and `RoleAwareHome`.

### State management and API access

- `src/store/authStore.js` (Zustand):
  - Holds `user`, `token`, and a `loading` flag.
  - `initAuth` reads the token from `localStorage`, calls `GET /auth/me` via the shared axios instance, and populates state plus `localStorage`.
  - `setAuth` updates React state and `localStorage` together when login/OTP verification succeeds.
  - `logout` calls `POST /auth/logout` (if available) and clears both state and local storage.
- `src/store/cartStore.js` (Zustand):
  - Provides `loadCart`, `addToCart`, `updateQuantity`, `removeItem`, and `clearCart` helpers.
  - All methods delegate to REST endpoints under `/cart` using the shared axios instance.
- `src/utils/api.js` defines a single axios instance:
  - `baseURL` is `http://localhost:5000/api`.
  - `withCredentials` is enabled.
  - An interceptor reads the latest token from `useAuthStore` on every request and sets the `Authorization: Bearer` header when present.
- `src/api/*.js` modules (e.g., `auth.js`, `cart.js`, `products.js`, `orders.js`, `startup.js`, `user.js`, `chat.js`, `admin.js`) wrap HTTP endpoints by domain, keeping components relatively free of raw axios calls.
- `src/hooks/useAuth.js` provides `useAuthSync`, an older-style hook that also syncs auth state from `localStorage` by calling `me()` from `src/api/auth.js`.

### Realtime and chat UI

- `src/hooks/useSocket.js` encapsulates the Socket.IO client:
  - Connects to `VITE_SOCKET_URL` (or `http://localhost:5000` by default) with `transports: ["websocket"]` and sends the JWT in the `auth` payload.
  - Returns a ref to the connected socket and wires up connection/disconnection logging and optional message handlers.
- `src/components/Chat/ChatList.jsx` and `src/components/Chat/ChatWindow.jsx` implement the primary chat UI:
  - `ChatList` polls `GET /chat` periodically to show available chat rooms and their last messages, with unread counts and active highlighting.
  - `ChatWindow` polls `GET /chat/:chatId` to display message history and posts new messages to an endpoint under `/chat`. It manages scroll position and presents messages with role-aware styling.

### Layouts and pages

- Layout components in `src/layouts/` (e.g., `AuthLayout`, `UserLayout`, `StartupLayout`, `AdminLayout`, `ChatLayout`) define the main shells and navigation per role, while nested routes supply page content.
- Pages under `src/pages/` are grouped by feature and closely mirror backend domains:
  - `auth/` – login/signup/OTP verification, wired to `src/api/auth.js`.
  - `user/` – product browsing, cart and checkout flows, order history, and user profile.
  - `startup/` – startup dashboards, inventory and product management, startup-specific orders.
  - `admin/` – admin dashboards for users, products, orders, and inventory.
  - `chat/` – role-agnostic chat views, backed by REST chat endpoints and sockets.
- Shared components live under `src/components/` (e.g., `common/Navbar`, `ui` primitives, and chat components) and are styled primarily with TailwindCSS plus small UI helpers.

## Tests and infrastructure

- **Backend tests**
  - Jest, Supertest, and related tooling are installed as dev dependencies in `backend/package.json`.
  - `npm test` in `backend/` runs the Jest suite with `NODE_ENV=test` and `--runInBand --detectOpenHandles`.
  - There is currently no committed Jest config or test files; when adding tests, keep them runnable via the existing `npm test` script and prefer co-locating tests with the backend source or under a dedicated tests directory.

- **Top-level `tests/` directory**
  - The root `tests/` directory exists but is currently empty; it is a natural place for future end-to-end or cross-service tests if you choose not to co-locate tests with source modules.

- **Infrastructure skeleton (`infra/`)**
  - `infra/ci/github-workflows/`, `infra/k8s/`, `infra/terraform/`, and `infra/cloudwatch/` are present as placeholders for CI pipelines, Kubernetes manifests, Terraform IaC, and CloudWatch configuration respectively.
  - As of now there are no committed configuration files; when introducing infra, keep it under these directories so agents can discover it easily.
