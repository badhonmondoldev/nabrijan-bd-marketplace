# NABRIJAN MARKET — REST API Endpoints Specification

## 1. Authentication & User Identity (`/api/auth/`)
- `POST /api/auth/register` — User account registration
- `POST /api/auth/login` — User authentication & JWT cookie issuance
- `POST /api/auth/logout` — Revoke session cookie
- `GET /api/auth/me` — Fetch authenticated user profile

## 2. Customer Marketplace (`/api/`)
- `GET /api/search` — Product catalog search & filtering
- `GET /api/cart` & `POST /api/cart` — Multi-vendor cart management
- `POST /api/orders/create` — Server-validated order creation with stock reservation
- `POST /api/coupons/validate` — Coupon rules validation engine

## 3. Seller Center (`/api/seller/`)
- `GET /api/seller/dashboard` — Merchant analytics & metrics
- `POST /api/seller/products` — Create & edit merchant products
- `GET /api/seller/inventory` — Stock audit log & inventory control
- `POST /api/seller/advertising` — Sponsored ad campaign launch

## 4. Admin Control Center (`/api/admin/`)
- `GET /api/admin/dashboard` — Platform GMV & operational metrics
- `POST /api/admin/sellers/[id]/review` — Seller verification approval/rejection
- `POST /api/admin/products/[id]/moderate` — Product moderation queue
- `GET /api/admin/analytics` — Executive BI reporting

## 5. Affiliate & Rewards (`/api/affiliate/`, `/api/rewards`)
- `POST /api/affiliate/register` — Affiliate partner onboarding
- `GET /api/affiliate/track` — Click attribution & 30-day cookie logger
- `GET /api/rewards` — Loyalty points ledger & tier status

## 6. B2B & Wholesale (`/api/b2b/`)
- `POST /api/b2b/rfq` — Buyer sourcing requirement creation
- `POST /api/b2b/quotations` — Supplier quotation submission & buyer acceptance
