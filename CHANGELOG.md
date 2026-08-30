# CHANGELOG — NABRIJAN MARKET

## [Master Build Release] - 2026-08-29

### Added
- **Wholesale & B2B Engine**:
  - `B2bPriceTier`, `Rfq`, and `RfqQuote` database models.
  - B2B Wholesale Hub ([`/b2b`](file:///home/badhondev/Documents/nabrijan%20market/src/app/b2b/page.tsx)) featuring tier pricing matrices (e.g., 1–10 = ৳500, 11–50 = ৳450, 51–100 = ৳420, 100+ = RFQ).
  - RFQ Portal ([`/b2b/rfq`](file:///home/badhondev/Documents/nabrijan%20market/src/app/b2b/rfq/page.tsx)) and API ([`/api/b2b/rfq`](file:///home/badhondev/Documents/nabrijan%20market/src/app/api/b2b/rfq/route.ts)).
- **Double-Entry Wallet Ledger Engine**:
  - Atomic ledger transactions (`CREDIT`, `DEBIT`, `HOLD`, `RELEASE`, `REFUND`, `COMMISSION`, `PAYOUT`) in `src/lib/ledger.ts`.
  - Customer Wallet Ledger ([`/account/wallet`](file:///home/badhondev/Documents/nabrijan%20market/src/app/account/wallet/page.tsx)).
  - Seller Financial Settlement Dashboard ([`/seller/finance`](file:///home/badhondev/Documents/nabrijan%20market/src/app/seller/finance/page.tsx)).
- **Abstractions & Engines**:
  - `AIService` provider abstraction ([`src/lib/ai.ts`](file:///home/badhondev/Documents/nabrijan%20market/src/lib/ai.ts)) with fallback logic for product descriptions, SEO tags, and shopping advice.
  - `CourierProvider` abstraction interface and `NabrijanExpressAdapter` ([`src/lib/courier.ts`](file:///home/badhondev/Documents/nabrijan%20market/src/lib/courier.ts)).
  - Fraud & Risk evaluation scoring engine (`LOW`, `MEDIUM`, `HIGH`) in [`src/lib/risk.ts`](file:///home/badhondev/Documents/nabrijan%20market/src/lib/risk.ts).
  - Rule-based Recommendation engine in [`src/lib/recommendations.ts`](file:///home/badhondev/Documents/nabrijan%20market/src/lib/recommendations.ts).
- **Customer Marketplace Additions**:
  - Advanced Search Page ([`/search`](file:///home/badhondev/Documents/nabrijan%20market/src/app/search/page.tsx)) and API ([`/api/search`](file:///home/badhondev/Documents/nabrijan%20market/src/app/api/search/route.ts)) supporting Bangla/English queries.
  - Saved Wishlist Manager ([`/account/wishlist`](file:///home/badhondev/Documents/nabrijan%20market/src/app/account/wishlist/page.tsx)).
  - Cart Manager ([`/cart`](file:///home/badhondev/Documents/nabrijan%20market/src/app/cart/page.tsx)) & Secure Order Checkout ([`/checkout`](file:///home/badhondev/Documents/nabrijan%20market/src/app/checkout/page.tsx)) with multi-vendor order splitting (`/api/orders/create`).
- **Seller Center & Advertising**:
  - Store Stock & Inventory Control ([`/seller/inventory`](file:///home/badhondev/Documents/nabrijan%20market/src/app/seller/inventory/page.tsx)).
  - Seller Promoted Advertising Dashboard ([`/seller/advertising`](file:///home/badhondev/Documents/nabrijan%20market/src/app/seller/advertising/page.tsx)).
- **Admin Control Center & CMS**:
  - Dynamic CMS Banner & Promotion Manager ([`/admin/cms`](file:///home/badhondev/Documents/nabrijan%20market/src/app/admin/cms/page.tsx)).
  - Merchant Product Moderation Queue ([`/admin/products`](file:///home/badhondev/Documents/nabrijan%20market/src/app/admin/products/page.tsx)).
  - Dispute Resolution Tickets ([`/admin/disputes`](file:///home/badhondev/Documents/nabrijan%20market/src/app/admin/disputes/page.tsx)).
  - Risk Engine & Fraud Review Queue ([`/admin/risk`](file:///home/badhondev/Documents/nabrijan%20market/src/app/admin/risk/page.tsx)).
- **Mobile-First UX**:
  - Responsive Mobile Bottom Navigation Bar ([`src/components/MobileBottomNav.tsx`](file:///home/badhondev/Documents/nabrijan%20market/src/components/MobileBottomNav.tsx)) for mobile viewports.
- **Documentation Suite**:
  - `docs/architecture.md`, `docs/database.md`, `docs/api.md`, `docs/deployment.md`, `docs/security.md`, `docs/business-rules.md`.
