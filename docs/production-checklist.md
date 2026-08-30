# NABRIJAN MARKET — Production Readiness Checklist & Deployment Manual

## 1. Pre-Deployment System Verification

- [x] **Prisma Database Schema**: Schema compiled with PostgreSQL foreign key indexes and cascading deletes (`npx prisma generate`).
- [x] **TypeScript Validation**: Zero type errors across 84 Next.js App Router endpoints (`npx tsc --noEmit`).
- [x] **ESLint Code Quality**: Clean build pass with zero errors (`npm run lint`).
- [x] **Production Bundle**: All 84 static and dynamic routes compiled (`npm run build`).
- [x] **RBAC Authorization**: Server-side guards enforced (`getAuthenticatedAdmin()`, `getAuthenticatedSellerStore()`).
- [x] **Financial Transaction Safety**: Atomic database transactions (`prisma.$transaction`) used for wallet balances, stock reservation, and affiliate payouts.
- [x] **SEO Protection**: `robots.ts` disallows indexing of private `/admin`, `/seller`, and `/account` endpoints while `sitemap.ts` indexes public marketplace catalog.

---

## 2. Production Environment Setup & Commands

1. **Database Migration**:
   ```bash
   npx prisma db push
   ```
2. **Seed Initial Data**:
   ```bash
   npm run seed
   ```
3. **Build & Launch Server**:
   ```bash
   npm run build
   npm run start
   ```

---

## 3. External Integration Requirements

| Provider Category | Status | Notes |
| :--- | :--- | :--- |
| **Cash on Delivery (COD)** | `WORKING` | Full server-validated checkout flow. |
| **Nabrijan Digital Wallet** | `WORKING` | Atomic wallet balance credit/debit ledger. |
| **Online Payment (bKash/Nagad/SSL)** | `EXTERNAL_PAYMENT_INTEGRATION_REQUIRED` | Requires merchant API credentials in `.env`. |
| **BD Courier APIs (Pathao/Steadfast)** | `EXTERNAL_INTEGRATION_REQUIRED` | Provider abstraction ready; requires API keys. |
| **SMS Gateway (SSL Wireless/Teletalk)** | `EXTERNAL_INTEGRATION_REQUIRED` | Adapter interface ready; requires gateway token. |
