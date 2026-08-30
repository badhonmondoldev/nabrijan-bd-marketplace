# NABRIJAN MARKET — System Architecture & Technical Specifications

## 1. High-Level Architecture Overview
NABRIJAN MARKET ("Buy. Sell. Earn. Grow.") is a Next.js 14 App Router multi-vendor marketplace platform optimized for Bangladesh e-commerce.

### Architectural Stack
- **Framework**: Next.js 14 App Router (React Server Components + Client Components)
- **Database & ORM**: PostgreSQL database with Prisma ORM v5.22
- **Authentication**: Unified Identity System with bcrypt hashing and JWT HTTP-only session cookies
- **Payment Abstraction**: Controlled PaymentProvider state machine supporting COD, Wallet, and Online Payment Gateways (bKash/Nagad/SSLCommerz)
- **Affiliate Engine**: Privacy-conscious 30-day cookie click attribution and state-machine commission engine
- **Courier Provider Abstraction**: Interface for Pathao, Steadfast, Paperfly, and RedX
- **Async Job Queue**: Non-blocking background queue for notifications, report generation, and campaign processing

## 2. Directory & Route Hierarchy
- `src/app/` — Next.js 14 App Router endpoints
  - `(customer)` — Customer Marketplace (Home, Categories, Product Details, Cart, Checkout)
  - `/seller/` — Merchant Store Center (Dashboard, Products, Inventory, Orders, Ads, Coupons)
  - `/admin/` — Enterprise Admin Control Center (Users, Sellers, Moderation, Finance, BI Analytics)
  - `/account/` — Unified Customer Portal (Orders, Wallet, Wishlist, Affiliate, Rewards)
  - `/b2b/` — Wholesale Commerce & RFQ Sourcing Portal
- `src/lib/` — Core Business Engine Modules
  - `db.ts` — Singleton Prisma Client instance
  - `auth.ts` — Authentication & JWT session manager
  - `admin-auth.ts` — Admin authorization guard
  - `seller-auth.ts` — Seller store verification guard
  - `orders.ts` — Order creation & stock reservation transactions
  - `payment.ts` — Payment provider abstraction engine
  - `affiliate.ts` — Affiliate commission lifecycle manager
  - `notifications.ts` — Decoupled multi-channel notification provider
  - `queue.ts` — Async background job queue engine
  - `courier.ts` — Delivery & courier provider abstraction
  - `ai-service.ts` — AI shopping service abstraction & intent parser
