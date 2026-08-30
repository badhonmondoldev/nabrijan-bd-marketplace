# NABRIJAN MARKET — Security & Authorization Architecture

## 1. Authentication & Session Security
- Passwords are salted and hashed using `bcrypt` (10 rounds).
- Sessions are maintained via HTTP-only, SameSite=Lax JWT cookies (`nabrijan_session`).
- Public endpoints sanitize user objects to prevent hash or private identity leaks.

## 2. Role-Based Access Control (RBAC)
- System roles (`CUSTOMER`, `SELLER`, `AFFILIATE`, `ADMIN`, `SUPPLIER`) enforce endpoint access.
- Admin APIs are protected by `getAuthenticatedAdmin()` guard in `src/lib/admin-auth.ts`.
- Seller APIs are protected by `getAuthenticatedSellerStore()` guard in `src/lib/seller-auth.ts`.

## 3. Financial Ledger & Transaction Safety
- Stock reservation and wallet deductions execute inside PostgreSQL atomic database transactions (`prisma.$transaction`).
- Self-purchase affiliate fraud is automatically flagged (`riskScore: "HIGH"`).
- Payment provider responses use controlled state machines without fake success hardcoding.

## 4. Verification Document Protection
- Merchant and supplier verification documents (NID, Trade License, TIN/BIN) are restricted to authorized admin routes (`/admin/sellers`, `/api/admin/sellers`).
