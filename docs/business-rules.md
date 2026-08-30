# NABRIJAN MARKET — Business Rules & Governance Standard

## 1. Multi-Vendor Order Splitting
- Shopping carts containing products from multiple distinct sellers automatically generate separate sub-orders per store upon checkout while maintaining a unified payment transaction.

## 2. Inventory & Stock Reservation
- Stock is atomically reserved when an order is created.
- If an order is cancelled or returned, reserved stock is automatically restored to merchant inventory with an audit log record.

## 3. Commission Engine & Payout Lifecycle
- Platform Commission: Standard 5% commission on gross sales.
- Affiliate Commission: 5% base referral commission.
- Commission States:
  - `PENDING`: Order created with referral cookie.
  - `LOCKED`: Order delivered to customer.
  - `APPROVED`: Return window passed; funds credited to Affiliate Wallet.
  - `REVERSED`: Order returned or cancelled.

## 4. Transparent Advertising Standards
- Ad campaigns (`SPONSORED_PRODUCT`, `SEARCH_PROMOTION`, `HOMEPAGE_PROMOTION`) require explicit badging (`"Sponsored"`).
- Organic search rankings are preserved without undisclosed manipulation.
