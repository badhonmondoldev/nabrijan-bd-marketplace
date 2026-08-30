# NABRIJAN MARKET — Deployment & Production Setup Guide

## 1. Environment Requirements
- **Node.js**: v18.x or v20.x LTS
- **Database**: PostgreSQL 14+
- **Platform**: Vercel / AWS / Docker Node Container

## 2. Environment Variables Configuration (`.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/nabrijan_db"
JWT_SECRET="your-secure-production-jwt-secret-key-32-chars"
NEXT_PUBLIC_APP_URL="https://nabriian-market.vercel.app"
```

## 3. Deployment Steps
1. Install dependencies:
   ```bash
   npm install
   ```
2. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```
3. Run Database Migrations:
   ```bash
   npx prisma db push
   ```
4. Seed Sample Database Records:
   ```bash
   npm run seed
   ```
5. Run Production Build:
   ```bash
   npm run build
   ```
6. Start Production Server:
   ```bash
   npm run start
   ```
