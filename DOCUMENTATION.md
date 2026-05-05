# GamingStore — Full Project Documentation

## Project Overview

A production-ready e-commerce web application for a gaming hardware store, built with a modern React stack, Supabase backend, and deployed on Vercel. Features full authentication, shopping cart, wishlist, PC builder, multi-currency, bilingual UI, and an admin dashboard.

---

## Tech Stack & Tools Used

| Category | Technology |
|---|---|
| Frontend Framework | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS 3 |
| Animations | Motion (Framer Motion v12) |
| Backend / Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| State Management | React Context API (7 custom providers) |
| Internationalization | i18next + react-i18next |
| Schema Validation | Zod |
| Utility Classes | clsx, tailwind-merge |
| Linting | ESLint |
| Deployment | Vercel |
| Version Control | Git |

---

## Functional Requirements (SRS)

### FR-1: User Authentication
- Register with email/password including first and last name
- Login with email/password
- OAuth sign-in via Google and Apple
- Phone OTP authentication (Saudi Arabia +966)
- Password reset via email
- Persistent sessions across page refreshes
- User profile management with editable display name

### FR-2: Product Catalog
- Browse 20+ gaming products (GPUs, CPUs, RAM, SSDs, custom PCs, peripherals)
- Filter products by category
- Client-side search and filtering by product name
- Product detail pages with full specs, images, ratings, and reviews
- Quick-view modal for fast browsing

### FR-3: Shopping Cart & Checkout
- Add, remove, and update cart items
- Quantity management per item
- Cart persisted in localStorage
- 3-step checkout wizard: Cart Review → Shipping Info → Payment

### FR-4: Wishlist
- Add/remove products to a personal wishlist
- Persisted locally via localStorage
- Synced to Supabase when user is logged in
- Merges local and database wishlists on login

### FR-5: Product Comparison
- Compare up to 3 products side-by-side
- Comparison table with full specs, ratings, and pricing
- Add to cart directly from comparison view

### FR-6: PC Builder Tool
- Interactive builder with 7 component categories: CPU, GPU, RAM, Storage, Cooling, Case, PSU
- Tier-based component selection: Flagship, Performance, Value
- Real-time total price calculation
- Add complete custom build to cart

### FR-7: Multi-Currency Support
- 8 currencies supported: BHD, JOD, SAR, KWD, OMR, QAR, AED, USD
- Real-time price conversion with exchange rates
- Currency symbol and formatting per locale

### FR-8: Bilingual UI (EN / AR)
- Full English and Arabic support with 200+ translation keys
- RTL (right-to-left) layout support for Arabic
- Automatic language detection from browser preference
- Language selection persisted in localStorage

### FR-9: Order Management
- Order history visible in user account
- Order status tracking: paid → processing → shipped → delivered
- Order detail view with line items and pricing

### FR-10: Admin Dashboard
- View all customer orders with pagination (15 orders per page)
- Update order status per order
- Access restricted to admin email only

---

## Non-Functional Requirements (SRS)

### NFR-1: Performance
- Code splitting with React.lazy() and Suspense — all pages except Home are lazy-loaded
- Vite production build with tree-shaking and minification
- Image delivery via CDN (Unsplash)

### NFR-2: Scalability
- Supabase PostgreSQL scales independently of the frontend
- Vercel serverless deployment auto-scales with traffic
- Context providers are isolated — new features do not affect existing ones

### NFR-3: Usability & Accessibility
- Mobile-first responsive design using Tailwind CSS breakpoints
- RTL layout support for Arabic-speaking users
- Toast notifications for all user actions (add to cart, wishlist, errors)
- Scroll progress indicator and back-to-top button
- Cookie consent banner

### NFR-4: Security
- Supabase Row Level Security (RLS) enforced on all database tables
- Auth tokens managed by Supabase — never stored manually
- All secrets stored in environment variables (.env.local, Vercel dashboard)
- Admin panel gated behind server-side email check

### NFR-5: Maintainability
- Feature-based folder structure: components, pages, context, hooks, lib
- ESLint enforced across all source files
- Path alias (@) for clean imports throughout the codebase
- Reusable UI components (modals, cards, drawers, toasts)

### NFR-6: Reliability
- Error boundary component to catch and display runtime errors gracefully
- Fallback images for broken or missing product images
- Auth state listener (onAuthStateChange) prevents stale sessions
- Wishlist merges offline and online data without loss

### NFR-7: SEO
- Dynamic meta tags per page (Open Graph, Twitter Cards)
- Per-page document titles via custom useSEO hook
- SPA routing handled via Vercel rewrite rules (vercel.json)

---

## Database Schema (Supabase / PostgreSQL)

| Table | Key Columns |
|---|---|
| `products` | id, title, brand, category, price, old_price, rating, reviews, images[], specs[], in_stock |
| `orders` | id, user_id, status, created_at |
| `order_items` | id, order_id, product_id, product_title, price, quantity |
| `profiles` | id, user_id, display_name, created_at |
| `wishlists` | id, user_id, product_id |

---

## Project Structure

```
src/
├── components/       # Reusable UI components (Navbar, CartDrawer, modals, etc.)
├── pages/            # Full page views (Home, Product, Checkout, Admin, Builder...)
├── context/          # React Context providers (Auth, Cart, Wishlist, Currency...)
├── hooks/            # Custom hooks (useSEO, usePageTitle, useRecentlyViewed)
├── lib/              # Supabase client, utilities, image fallbacks
├── data/             # Static product catalog and PC builder parts
└── locales/          # i18n translation files (en.json, ar.json)
```

---

## Routing Structure

| Route | Page |
|---|---|
| `/` | HomePage |
| `/product/:id` | ProductDetailPage |
| `/checkout` | CheckoutPage |
| `/wishlist` | WishlistPage |
| `/builder` | BuilderPage |
| `/account` | AccountPage (sign in / register / profile) |
| `/admin` | AdminPage (order management) |
| `/about` | AboutPage |
| `/deals` | DealsPage |
| `/support` and sub-routes | SupportPage (FAQ, contact, returns, etc.) |
| `*` | NotFoundPage |

All pages except HomePage use React.lazy() for code splitting.

---

## State Management

7 React Context providers manage all global state:

| Context | Responsibility |
|---|---|
| AuthContext | User session, login, signup, logout |
| ProductsContext | Product catalog, seeded from local data and Supabase |
| CartContext | Cart items, quantities, localStorage persistence |
| WishlistContext | Wishlist with dual local/Supabase sync |
| CurrencyContext | Selected currency, conversion rates, price formatting |
| CompareContext | Products selected for comparison (max 3) |
| ToastContext | Toast notification queue and display |

---

## Authentication Flow

- Email/Password: signUp() with first_name/last_name metadata, signInWithPassword()
- OAuth: Google and Apple via signInWithOAuth()
- Phone OTP: Saudi Arabia numbers via signInWithOtp() and verifyOtp()
- Password Reset: resetPasswordForEmail()
- Session: getSession() on load + onAuthStateChange() listener throughout app lifecycle
- Display name persisted in the profiles table (survives OAuth re-logins)

---

## CV-Ready Summary

GamingStore is a full-stack e-commerce platform built with React 19, Vite, Tailwind CSS, and Supabase. It includes user authentication (Email, Google/Apple OAuth, Phone OTP), shopping cart, wishlist, product comparison, interactive PC builder, multi-currency support (8 currencies), bilingual EN/AR UI with RTL, an admin order dashboard, and Vercel deployment. State is managed via 7 custom React Context providers; the database is powered by Supabase PostgreSQL with Row Level Security.

---

## Author

**Etchado** — ikhaledi95@gmail.com
