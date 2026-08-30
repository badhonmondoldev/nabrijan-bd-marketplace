const { execSync } = require('child_process');
const bcrypt = require('bcryptjs');

async function generateAndRunSeed() {
  console.log('🌱 Generating Supabase seed SQL statements...');

  const passwordHash = await bcrypt.hash('DevSeedSecret#2026', 10);

  const sqlStatements = [];

  // 1. Insert Roles
  sqlStatements.push(`
    INSERT INTO "Role" ("id", "name", "description", "createdAt", "updatedAt") VALUES
    ('role-super-admin', 'SUPER_ADMIN', 'Full system control and platform oversight', NOW(), NOW()),
    ('role-admin', 'ADMIN', 'Platform manager and administrator', NOW(), NOW()),
    ('role-support', 'SUPPORT', 'Customer and seller support staff', NOW(), NOW()),
    ('role-seller', 'SELLER', 'Multi-vendor merchant account', NOW(), NOW()),
    ('role-affiliate', 'AFFILIATE', 'Affiliate marketer and promoter', NOW(), NOW()),
    ('role-customer', 'CUSTOMER', 'Standard buyer account', NOW(), NOW())
    ON CONFLICT ("name") DO NOTHING;
  `);

  // 2. Insert Super Admin User
  sqlStatements.push(`
    INSERT INTO "User" ("id", "email", "phone", "name", "passwordHash", "status", "defaultRole", "createdAt", "updatedAt") VALUES
    ('user-super-admin', 'superadmin@nabrijan.com', '+8801700000001', 'NABRIJAN Super Admin', '${passwordHash}', 'ACTIVE', 'SUPER_ADMIN', NOW(), NOW())
    ON CONFLICT ("email") DO NOTHING;

    INSERT INTO "UserRole" ("id", "userId", "roleId") VALUES
    ('ur-super-1', 'user-super-admin', 'role-super-admin'),
    ('ur-super-2', 'user-super-admin', 'role-admin'),
    ('ur-super-3', 'user-super-admin', 'role-customer')
    ON CONFLICT DO NOTHING;
  `);

  // 3. Insert Categories
  const categories = [
    ['cat-1', 'Electronics & Gadgets', 'electronics-gadgets', 'Cpu', 'Smartphones, laptops, accessories and audio'],
    ['cat-2', 'Fashion & Apparel', 'fashion-apparel', 'Shirt', 'Traditional & western clothing for men and women'],
    ['cat-3', 'Home & Kitchen', 'home-kitchen', 'Home', 'Cookware, decor, and home essentials'],
    ['cat-4', 'Health & Beauty', 'health-beauty', 'Heart', 'Skincare, cosmetics, personal care'],
    ['cat-5', 'Groceries & Foods', 'groceries-foods', 'ShoppingBag', 'Fresh rice, oils, spices, and snacks'],
    ['cat-6', 'Baby & Kids', 'baby-kids', 'Smile', 'Toys, clothing, baby care products'],
    ['cat-7', 'Sports & Outdoors', 'sports-outdoors', 'Activity', 'Cricket gear, fitness equipment, outdoor wear'],
    ['cat-8', 'Automotive & Hardware', 'automotive-hardware', 'Tool', 'Car accessories, tools, electrical supplies'],
    ['cat-9', 'Books & Stationery', 'books-stationery', 'BookOpen', 'Academic books, novels, office supplies'],
    ['cat-10', 'B2B Wholesale Raw Materials', 'b2b-raw-materials', 'Box', 'Textiles, packaging, and industrial supplies']
  ];

  const catValues = categories.map(c => `('${c[0]}', '${c[1]}', '${c[2]}', '${c[3]}', '${c[4]}', NOW(), NOW())`).join(',\n');
  sqlStatements.push(`
    INSERT INTO "Category" ("id", "name", "slug", "icon", "description", "createdAt", "updatedAt") VALUES
    ${catValues}
    ON CONFLICT ("slug") DO NOTHING;
  `);

  // 4. Insert Brands
  const brands = [
    ['b-1', 'Walton BD', 'walton-bd', 'https://images.unsplash.com/photo-1550009158-9ebf69173e03'],
    ['b-2', 'Apex Footwear', 'apex-footwear', 'https://images.unsplash.com/photo-1549298916-b41d501d3772'],
    ['b-3', 'Aarong Crafts', 'aarong-crafts', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b'],
    ['b-4', 'Samsung BD', 'samsung-bd', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf'],
    ['b-5', 'Xiaomi BD', 'xiaomi-bd', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'],
    ['b-6', 'Pran Foods', 'pran-foods', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb'],
    ['b-7', 'Square Organics', 'square-organics', 'https://images.unsplash.com/photo-1540420773420-3366772f4999'],
    ['b-8', 'Bata Bangladesh', 'bata-bangladesh', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86']
  ];
  const brandValues = brands.map(b => `('${b[0]}', '${b[1]}', '${b[2]}', '${b[3]}', NOW(), NOW())`).join(',\n');
  sqlStatements.push(`
    INSERT INTO "Brand" ("id", "name", "slug", "logo", "createdAt", "updatedAt") VALUES
    ${brandValues}
    ON CONFLICT ("slug") DO NOTHING;
  `);

  // 5. Insert Stores & Sellers
  const sellers = [
    ['user-seller-1', 'seller1@nabrijan.com', 'Kamal Ahmed', '+8801810000001', 'store-1', 'Dhaka Tech Plaza', 'dhaka-tech-plaza', 'Dhaka'],
    ['user-seller-2', 'seller2@nabrijan.com', 'Shirin Akter', '+8801810000002', 'store-2', 'Chittagong Fashion Hub', 'chittagong-fashion-hub', 'Chittagong'],
    ['user-seller-3', 'seller3@nabrijan.com', 'Imran Khan', '+8801810000003', 'store-3', 'Sylhet Organic Mart', 'sylhet-organic-mart', 'Sylhet'],
    ['user-seller-4', 'seller4@nabrijan.com', 'Mahmud Hasan', '+8801810000004', 'store-4', 'Rajshahi Silk House', 'rajshahi-silk-house', 'Rajshahi']
  ];

  for (const s of sellers) {
    sqlStatements.push(`
      INSERT INTO "User" ("id", "email", "phone", "name", "passwordHash", "status", "defaultRole", "createdAt", "updatedAt") VALUES
      ('${s[0]}', '${s[1]}', '${s[3]}', '${s[2]}', '${passwordHash}', 'ACTIVE', 'SELLER', NOW(), NOW())
      ON CONFLICT ("email") DO NOTHING;

      INSERT INTO "UserRole" ("id", "userId", "roleId") VALUES
      ('ur-${s[0]}', '${s[0]}', 'role-seller')
      ON CONFLICT DO NOTHING;

      INSERT INTO "Store" ("id", "ownerId", "name", "slug", "description", "status", "commissionRate", "rating", "bkashNumber", "createdAt", "updatedAt") VALUES
      ('${s[4]}', '${s[0]}', '${s[5]}', '${s[6]}', 'Verified merchant operating in ${s[7]}, Bangladesh.', 'ACTIVE', 5.0, 4.9, '${s[3]}', NOW(), NOW())
      ON CONFLICT ("slug") DO NOTHING;
    `);
  }

  // 6. Insert Products
  const products = [
    ['p-1', 'store-1', 'cat-1', 'b-5', 'Xiaomi Redmi Note 13 Pro 5G (8GB/256GB)', 'xiaomi-redmi-note-13-pro', 'Official Bangladesh official warranty smartphone', 32999.0, 29999.0, 45, 'SKU-XIA-001', true, 'ACTIVE'],
    ['p-2', 'store-1', 'cat-1', 'b-1', 'Walton Primo S8 Mini LED Smart TV 43 Inch', 'walton-primo-s8-tv', 'Full HD Smart Android TV with voice remote', 38500.0, 34999.0, 20, 'SKU-WAL-002', true, 'ACTIVE'],
    ['p-3', 'store-2', 'cat-2', 'b-3', 'Aarong Hand-Embroidered Jamdani Saree', 'aarong-jamdani-saree', 'Traditional 100% pure cotton Jamdani saree', 8500.0, 7800.0, 15, 'SKU-AAR-003', true, 'ACTIVE'],
    ['p-4', 'store-2', 'cat-2', 'b-2', 'Apex Genuine Leather Formal Shoes for Men', 'apex-leather-formal-shoes', 'Premium handcrafted leather shoes', 4500.0, 3990.0, 30, 'SKU-APX-004', true, 'ACTIVE'],
    ['p-5', 'store-3', 'cat-5', 'b-7', 'Square Organic Pure Mustard Oil 5 Liter', 'square-mustard-oil-5l', 'Cold-pressed 100% natural mustard oil', 1250.0, 1150.0, 100, 'SKU-SQR-005', false, 'ACTIVE'],
    ['p-6', 'store-3', 'cat-5', 'b-6', 'Pran Premium Kalijira Rice 5KG Pack', 'pran-kalijira-rice-5kg', 'Aromatic fine grain Kalijira polao rice', 650.0, 599.0, 150, 'SKU-PRN-006', false, 'ACTIVE'],
    ['p-7', 'store-4', 'cat-2', 'b-3', 'Rajshahi Pure Silk Kurti with Dupatta', 'rajshahi-silk-kurti', 'Authentic Rajshahi Mulberry silk Kurti set', 5200.0, 4600.0, 25, 'SKU-RAJ-007', true, 'ACTIVE'],
    ['p-8', 'store-1', 'cat-1', 'b-4', 'Samsung Galaxy Buds2 Pro Wireless Earbuds', 'samsung-buds2-pro', 'Active Noise Canceling Bluetooth Earbuds', 16999.0, 14999.0, 40, 'SKU-SAM-008', true, 'ACTIVE']
  ];

  const prodValues = products.map(p => `('${p[0]}', '${p[1]}', '${p[2]}', '${p[3]}', '${p[4]}', '${p[5]}', '${p[6]}', ${p[7]}, ${p[8]}, ${p[9]}, '${p[10]}', ${p[11]}, '${p[12]}', NOW(), NOW())`).join(',\n');
  sqlStatements.push(`
    INSERT INTO "Product" ("id", "storeId", "categoryId", "brandId", "title", "slug", "description", "basePrice", "salePrice", "stockQuantity", "sku", "isFeatured", "status", "createdAt", "updatedAt") VALUES
    ${prodValues}
    ON CONFLICT ("slug") DO NOTHING;
  `);

  // 7. System Settings
  sqlStatements.push(`
    INSERT INTO "SystemSetting" ("id", "key", "value", "description", "updatedAt") VALUES
    ('ss-1', 'PLATFORM_COMMISSION_RATE', '5.0', 'Default vendor commission rate percentage', NOW()),
    ('ss-2', 'PLATFORM_CURRENCY', 'BDT', 'Primary platform currency', NOW())
    ON CONFLICT ("key") DO NOTHING;
  `);

  const fullSql = sqlStatements.join('\n\n');
  const fs = require('fs');
  fs.writeFileSync('prisma/seed_data.sql', fullSql);

  console.log('✅ Created prisma/seed_data.sql. Executing SQL on Supabase DB...');
  if (!process.env.SUPABASE_ACCESS_TOKEN) {
    console.error('❌ Error: SUPABASE_ACCESS_TOKEN environment variable is missing.');
    process.exit(1);
  }
  execSync('npx supabase db query --linked -f prisma/seed_data.sql', { stdio: 'inherit' });
  console.log('🚀 Supabase DB Seeding Complete!');
}

generateAndRunSeed().catch(console.error);
