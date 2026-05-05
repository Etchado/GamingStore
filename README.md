# GamingStore

A production-ready e-commerce web application for a gaming hardware store. Built with React 19, Vite, Tailwind CSS, and Supabase — featuring full authentication, shopping cart, wishlist, PC builder, multi-currency support, bilingual UI (EN/AR), and an admin dashboard.

---

## Live Demo

Deployed on Vercel — [gaming-st0re.vercel.app](https://gaming-st0re.vercel.app/)

---

## Tech Stack

| Category | Technology |
|---|---|
| Frontend Framework | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS 3 |
| Animations | Motion (Framer Motion v12) |
| Backend / Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| State Management | React Context API (7 providers) |
| Internationalization | i18next + react-i18next |
| Schema Validation | Zod |
| Deployment | Vercel |

---

## Features

### User Authentication
- Email/password registration and login
- OAuth sign-in via Google and Apple
- Phone OTP authentication (Saudi Arabia +966)
- Password reset via email
- Persistent sessions and editable display name

### Product Catalog
- 20+ gaming products: GPUs, CPUs, RAM, SSDs, custom PCs, peripherals
- Category filtering and client-side search
- Product detail pages with specs, images, ratings, and reviews
- Quick-view modals

### Shopping Cart & Checkout
- Add/remove/update items with localStorage persistence
- 3-step checkout wizard: Cart Review → Shipping Info → Payment

### Wishlist
- Add/remove products with local storage backup
- Synced to Supabase when logged in
- Merges offline and online wishlists on login

### Product Comparison
- Compare up to 3 products side-by-side
- Spec table with ratings, pricing, and add-to-cart

### PC Builder Tool
- Interactive builder across 7 categories: CPU, GPU, RAM, Storage, Cooling, Case, PSU
- Tier-based selection: Flagship, Performance, Value
- Real-time total price and add-build-to-cart

### Multi-Currency Support
- 8 currencies: SAR, AED, KWD, BHD, OMR, QAR, JOD, USD
- Real-time price conversion and locale-aware formatting

### Bilingual UI (EN / AR)
- Full English and Arabic translations (200+ keys)
- RTL layout support for Arabic
- Auto language detection from browser with localStorage persistence

### Admin Dashboard
- View and manage all customer orders
- Update order status: paid → processing → shipped → delivered → cancelled
- Pagination (15 orders/page)
- Access restricted to admin email

---

## Database Schema (Supabase / PostgreSQL)

| Table | Purpose |
|---|---|
| `products` | Full product catalog with specs, images, pricing |
| `orders` | Customer orders with status tracking |
| `order_items` | Line items linked to each order |
| `profiles` | Extended user data (display name) |
| `wishlists` | User wishlist product IDs |

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

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project with the schema above

### Installation

```bash
git clone https://github.com/your-username/GamingStore.git
cd GamingStore
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## Deployment

Deployed on **Vercel** with a SPA rewrite rule (`vercel.json`) to handle client-side routing. Environment variables are set via the Vercel dashboard.

---

## Author

**Etchado** — ikhaledi95@gmail.com
