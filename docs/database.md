# NABRIJAN MARKET — Database Schema & Data Models Documentation

## 1. Core Data Models Summary

### Identity & Access
- `User`: Unified identity record (`CUSTOMER`, `SELLER`, `AFFILIATE`, `ADMIN`, `SUPPLIER`).
- `Role`: System roles mapped to users (`UserRole`).
- `Address`: Multi-district Bangladeshi delivery addresses (`district`, `thana`, `addressLine`).

### Vendor Commerce
- `Store`: Seller storefront (`name`, `slug`, `status: DRAFT|PENDING|VERIFIED|REJECTED|SUSPENDED`, `commissionRate`).
- `Product`: Product entity (`title`, `slug`, `basePrice`, `salePrice`, `stockQuantity`, `sku`, `isWholesale`, `moq`).
- `Inventory`: Audit log of stock movements (`INCOMING`, `OUTGOING`, `RESERVED`, `ADJUSTMENT`).

### Cart, Orders & Financial Ledger
- `CartItem`: Multi-vendor shopping cart item (`quantity`, `variantId`).
- `Order`: Multi-vendor parent & seller sub-orders (`orderStatus`, `paymentStatus`, `totalAmount`, `discountAmount`).
- `Wallet`: Unified user digital wallet balance (`balance`, `currency: BDT`).
- `WalletTransaction`: Financial audit trail (`CREDIT`, `DEBIT`, `type: LedgerTxType`).

### Affiliate & Customer Growth
- `AffiliateLink`: Unique referral code tracker (`referralCode`, `clicksCount`).
- `AffiliateCommission`: Lifecycle status (`PENDING`, `LOCKED`, `APPROVED`, `REVERSED`, `PAID`, `riskScore`).
- `RewardAccount` & `RewardTransaction`: Customer loyalty points balance & activity log.

### B2B, Advertising & Campaigns
- `Coupon` & `CouponUsage`: Percentage, Fixed, and Free Shipping vouchers with usage limits.
- `Campaign` & `CampaignProduct`: Flash sales and seasonal campaign pricing.
- `AdCampaign` & `AdEvent`: Sponsored product ad campaigns and impression/click events.
- `Rfq` & `RfqQuote`: Request for Quotation buyer/supplier state machine.
