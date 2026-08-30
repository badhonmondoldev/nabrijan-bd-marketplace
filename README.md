# NABRIJAN MARKET — Full-Stack Multi-Vendor E-Commerce Platform

> **Tagline**: Buy. Sell. Earn. Grow.
> **Platform Overview**: Bangladesh-first multi-vendor marketplace, seller center, affiliate system, B2B wholesale portal, enterprise admin control center, and AI-ready commerce ecosystem built with Next.js 14 App Router, PostgreSQL, Prisma ORM, and TypeScript.

---

## 🚀 Key Modules & Architecture

### 🛒 1. Customer Marketplace
- CMS-driven Homepage with Hero banners, Flash Sales, Popular Categories, and Recommended Products.
- Category hierarchy (`/categories`, `/category/[slug]`).
- Product Catalog (`/products`) with Smart Intent Search (`"Gaming phone under 30000"`), filters, and explicit `"Sponsored"` badges.
- Interactive Variant selector, Wishlist, Recently Viewed, Cart & Server-Validated Checkout.

### 🏬 2. Seller Center (`/seller`)
- 5-step Merchant Onboarding Wizard (`/seller/onboarding`).
- Seller Dashboard (`/seller`), Product Management, Stock & Inventory Control with audit logs.
- Seller Sponsored Advertising Portal (`/seller/advertising`) and Promotional Coupon Manager (`/seller/coupons`).

### 👑 3. Enterprise Admin Control Center (`/admin`)
- Admin Authorization Guard (`src/lib/admin-auth.ts`).
- Real-time Dashboard Metrics (`/admin`), User Management & Role Switcher (`/admin/users`).
- Seller Verification Desk (`/admin/sellers`) & Product Moderation Queue (`/admin/products`).
- Category & Brand CRUD (`/admin/categories`), Master Financial Ledger & Payouts (`/admin/finance`).
- Affiliate Risk Queue (`/admin/affiliates`) & Executive Business Intelligence Reporting (`/admin/analytics`).

### 💸 4. Affiliate, Referral & Rewards System
- Affiliate Onboarding (`/account/affiliate`) generating unique referral tracking codes (e.g. `REF-BD-8921`).
- Privacy-conscious 30-day click attribution cookie (`/api/affiliate/track`).
- State-machine Commission Engine (`src/lib/affiliate.ts`): `PENDING` &rarr; `LOCKED` &rarr; `APPROVED` &rarr; `REVERSED` &rarr; `PAID`.
- Customer Rewards Club (`/account/rewards`) with points balance, tier multipliers (Bronze, Silver, Gold, Platinum), and activity history.

### 🏢 5. B2B & Wholesale Commerce (`/b2b`, `/b2b/rfq`)
- Support for `RETAIL`, `WHOLESALE`, and `BOTH` sales modes with MOQ requirements and volume price tiers (`B2bPriceTier`).
- Request for Quotation (RFQ) Marketplace (`/b2b/rfq`) and Quotation state machine (`DRAFT` &rarr; `SENT` &rarr; `VIEWED` &rarr; `ACCEPTED` &rarr; `REJECTED` &rarr; `EXPIRED`).

### 🧠 6. AI Shopping & Engine Abstractions
- `AIService` abstraction (`src/lib/ai-service.ts`) with intent parsing, product title/description generator, review summarizer, and recommendation routines.
- `CourierEngine` abstraction (`src/lib/courier.ts`) with Pathao, Steadfast, Paperfly, and RedX adapters.
- Decoupled `NotificationEngine` (`src/lib/notifications.ts`) and Async `JobQueue` (`src/lib/queue.ts`).

---

## 🛠 Local Setup & Commands

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Migration & Prisma Generation**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Seed Database**:
   ```bash
   npm run seed
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Typecheck & Build**:
   ```bash
   npx tsc --noEmit
   npm run lint
   npm run build
   ```

---

## 📚 Technical Documentation Suite
- [Architecture Specifications](docs/architecture.md)
- [Database Data Models](docs/database.md)
- [REST API Reference](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Security & Authorization](docs/security.md)
- [Business Rules & Governance](docs/business-rules.md)