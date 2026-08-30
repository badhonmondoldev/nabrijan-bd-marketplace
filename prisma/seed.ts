import { PrismaClient, SystemRole, StoreStatus, ProductStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NABRIJAN MARKET database seeding...');

  // 1. Create Roles
  const rolesList: { name: SystemRole; description: string }[] = [
    { name: 'SUPER_ADMIN', description: 'Full system control and platform oversight' },
    { name: 'ADMIN', description: 'Platform manager and administrator' },
    { name: 'SUPPORT', description: 'Customer and seller support staff' },
    { name: 'SELLER', description: 'Multi-vendor merchant account' },
    { name: 'AFFILIATE', description: 'Affiliate marketer and promoter' },
    { name: 'CUSTOMER', description: 'Standard buyer account' },
  ];

  const roleMap: Record<SystemRole, string> = {} as any;

  for (const r of rolesList) {
    const createdRole = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: { name: r.name, description: r.description },
    });
    roleMap[r.name] = createdRole.id;
  }

  // 2. Create Permissions & Attach to Roles
  const permissionsList = [
    { name: 'users.read', description: 'Read user information' },
    { name: 'users.update', description: 'Update user accounts' },
    { name: 'users.suspend', description: 'Suspend user accounts' },
    { name: 'products.create', description: 'Create marketplace products' },
    { name: 'products.update', description: 'Update marketplace products' },
    { name: 'products.approve', description: 'Approve vendor products' },
    { name: 'orders.read', description: 'View customer & store orders' },
    { name: 'orders.update', description: 'Update order statuses' },
    { name: 'finance.read', description: 'View financial ledgers & wallets' },
    { name: 'finance.manage', description: 'Manage payouts & wallet funds' },
    { name: 'stores.manage', description: 'Approve and manage store profiles' },
    { name: 'affiliate.manage', description: 'Manage affiliate tracking & payouts' },
  ];

  for (const p of permissionsList) {
    const perm = await prisma.permission.upsert({
      where: { name: p.name },
      update: { description: p.description },
      create: p,
    });

    // Give all to Super Admin
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roleMap.SUPER_ADMIN,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: roleMap.SUPER_ADMIN,
        permissionId: perm.id,
      },
    });
  }

  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEV_SEED !== 'true' && !process.env.BOOTSTRAP_ADMIN_PASSWORD) {
    console.log('⚠️ Production environment detected. Skipping default development seed accounts for security.');
    console.log('To bootstrap an initial production admin account, set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD env vars.');
    return;
  }

  const rawSeedPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD || 'DevSeedSecret#2026';
  const hashedPassword = await bcrypt.hash(rawSeedPassword, 10);

  const superAdminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL || 'superadmin@nabrijan.com';

  // 3. Create Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      name: 'NABRIJAN Super Admin',
      email: 'superadmin@nabrijan.com',
      phone: '+8801700000001',
      passwordHash: hashedPassword,
      defaultRole: 'SUPER_ADMIN',
      userRoles: {
        create: [
          { roleId: roleMap.SUPER_ADMIN },
          { roleId: roleMap.ADMIN },
          { roleId: roleMap.CUSTOMER },
        ],
      },
      profile: {
        create: {
          bio: 'System Administrator for Nabrijan Market',
          nidNumber: '19901234567890',
        },
      },
      addresses: {
        create: {
          fullName: 'Super Admin Office',
          phone: '+8801700000001',
          division: 'Dhaka',
          district: 'Dhaka',
          upazila: 'Gulshan',
          area: 'Gulshan 2',
          detailedAddress: 'House 42, Road 11, Block D',
          postalCode: '1212',
          isDefault: true,
        },
      },
    },
  });

  // 4. Create 3 Admin / Staff accounts
  const staffData = [
    { name: 'Tanvir Hossain', email: 'tanvir.admin@nabrijan.com', phone: '+8801700000002', role: 'ADMIN' as SystemRole },
    { name: 'Nusrat Jahan', email: 'nusrat.admin@nabrijan.com', phone: '+8801700000003', role: 'ADMIN' as SystemRole },
    { name: 'Rafiq Islam', email: 'rafiq.support@nabrijan.com', phone: '+8801700000004', role: 'SUPPORT' as SystemRole },
  ];

  for (const staff of staffData) {
    await prisma.user.upsert({
      where: { email: staff.email },
      update: {},
      create: {
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        passwordHash: hashedPassword,
        defaultRole: staff.role,
        userRoles: {
          create: [{ roleId: roleMap[staff.role] }],
        },
        profile: { create: { bio: `Nabrijan staff member - ${staff.role}` } },
      },
    });
  }

  // 5. Create 10 Categories
  const categoriesData = [
    { name: 'Electronics & Gadgets', slug: 'electronics-gadgets', icon: 'Cpu', description: 'Smartphones, laptops, accessories and audio' },
    { name: 'Fashion & Apparel', slug: 'fashion-apparel', icon: 'Shirt', description: 'Traditional & western clothing for men and women' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', icon: 'Home', description: 'Cookware, decor, and home essentials' },
    { name: 'Health & Beauty', slug: 'health-beauty', icon: 'Heart', description: 'Skincare, cosmetics, personal care' },
    { name: 'Groceries & Foods', slug: 'groceries-foods', icon: 'ShoppingBag', description: 'Fresh rice, oils, spices, and snacks' },
    { name: 'Baby & Kids', slug: 'baby-kids', icon: 'Smile', description: 'Toys, clothing, baby care products' },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors', icon: 'Activity', description: 'Cricket gear, fitness equipment, outdoor wear' },
    { name: 'Automotive & Hardware', slug: 'automotive-hardware', icon: 'Tool', description: 'Car accessories, tools, electrical supplies' },
    { name: 'Books & Stationery', slug: 'books-stationery', icon: 'BookOpen', description: 'Academic books, novels, office supplies' },
    { name: 'B2B Wholesale Raw Materials', slug: 'b2b-raw-materials', icon: 'Box', description: 'Textiles, packaging, and industrial supplies' },
  ];

  const categoryIds: string[] = [];
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryIds.push(createdCat.id);
  }

  // 6. Create 10 Brands
  const brandsData = [
    { name: 'Walton BD', slug: 'walton-bd', logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03' },
    { name: 'Apex Footwear', slug: 'apex-footwear', logo: 'https://images.unsplash.com/photo-1549298916-b41d501d3772' },
    { name: 'Aarong Crafts', slug: 'aarong-crafts', logo: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b' },
    { name: 'Samsung BD', slug: 'samsung-bd', logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf' },
    { name: 'Xiaomi BD', slug: 'xiaomi-bd', logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9' },
    { name: 'Pran Foods', slug: 'pran-foods', logo: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb' },
    { name: 'Square Organics', slug: 'square-organics', logo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999' },
    { name: 'Bata Bangladesh', slug: 'bata-bangladesh', logo: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86' },
    { name: 'Richman BD', slug: 'richman-bd', logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf' },
    { name: 'Vision Electronics', slug: 'vision-electronics', logo: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1' },
  ];

  const brandIds: string[] = [];
  for (const b of brandsData) {
    const createdBrand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
    brandIds.push(createdBrand.id);
  }

  // 7. Create 10 Sellers with Stores
  const sellersData = [
    { name: 'Kamal Ahmed', storeName: 'Dhaka Tech Plaza', slug: 'dhaka-tech-plaza', phone: '+8801810000001', city: 'Dhaka' },
    { name: 'Shirin Akter', storeName: 'Chittagong Fashion Hub', slug: 'chittagong-fashion-hub', phone: '+8801810000002', city: 'Chittagong' },
    { name: 'Imran Khan', storeName: 'Sylhet Organic Mart', slug: 'sylhet-organic-mart', phone: '+8801810000003', city: 'Sylhet' },
    { name: 'Mahmud Hasan', storeName: 'Rajshahi Silk House', slug: 'rajshahi-silk-house', phone: '+8801810000004', city: 'Rajshahi' },
    { name: 'Farhana Yeasmin', storeName: 'Khulna Home Appliances', slug: 'khulna-home-appliances', phone: '+8801810000005', city: 'Khulna' },
    { name: 'Jasim Uddin', storeName: 'Barisal Fisheries & Spices', slug: 'barisal-spices', phone: '+8801810000006', city: 'Barisal' },
    { name: 'Sultana Begum', storeName: 'Rangpur Craft Center', slug: 'rangpur-craft-center', phone: '+8801810000007', city: 'Rangpur' },
    { name: 'Arif Chowdhury', storeName: 'Comilla Gadget World', slug: 'comilla-gadget-world', phone: '+8801810000008', city: 'Comilla' },
    { name: 'Monir Hossain', storeName: 'Bogura Food Industries', slug: 'bogura-food-ind', phone: '+8801810000009', city: 'Bogura' },
    { name: 'Mitu Das', storeName: 'Mymensingh Kids Corner', slug: 'mymensingh-kids', phone: '+8801810000010', city: 'Mymensingh' },
  ];

  const storeIds: string[] = [];

  for (let i = 0; i < sellersData.length; i++) {
    const s = sellersData[i];
    const sellerEmail = `seller${i + 1}@nabrijan.com`;
    const user = await prisma.user.upsert({
      where: { email: sellerEmail },
      update: {},
      create: {
        name: s.name,
        email: sellerEmail,
        phone: s.phone,
        passwordHash: hashedPassword,
        defaultRole: 'SELLER',
        userRoles: {
          create: [
            { roleId: roleMap.SELLER },
            { roleId: roleMap.CUSTOMER },
          ],
        },
        profile: {
          create: {
            tradeLicense: `TL-BD-2026-${1000 + i}`,
            nidNumber: `1985${1000000 + i}`,
          },
        },
        stores: {
          create: {
            name: s.storeName,
            slug: s.slug,
            description: `Official verified multi-vendor store operating in ${s.city}, Bangladesh.`,
            status: StoreStatus.ACTIVE,
            commissionRate: 5.0,
            rating: 4.8,
            bkashNumber: s.phone,
            nagadNumber: s.phone,
            bankName: 'Dutch Bangla Bank Ltd',
            bankAccountNo: `120.110.${5000 + i}`,
            warehouses: {
              create: {
                name: `${s.storeName} Central Warehouse`,
                location: `${s.city}, Bangladesh`,
                contactPhone: s.phone,
              },
            },
            wallets: {
              create: {
                balance: 15500.0,
                frozenBalance: 0.0,
                currency: 'BDT',
              },
            },
          },
        },
      },
      include: { stores: true },
    });

    if (user.stores.length > 0) {
      storeIds.push(user.stores[0].id);
    }
  }

  // 8. Create Sample Customer & Affiliate Users
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@nabrijan.com' },
    update: {},
    create: {
      name: 'Sajid Rahman',
      email: 'customer@nabrijan.com',
      phone: '+8801900000001',
      passwordHash: hashedPassword,
      defaultRole: 'CUSTOMER',
      userRoles: { create: [{ roleId: roleMap.CUSTOMER }] },
      addresses: {
        create: {
          fullName: 'Sajid Rahman',
          phone: '+8801900000001',
          division: 'Dhaka',
          district: 'Dhaka',
          upazila: 'Dhanmondi',
          area: 'Dhanmondi 27',
          detailedAddress: 'Flat 4A, Green Peace Apartment, Road 27',
          postalCode: '1209',
          isDefault: true,
        },
      },
    },
  });

  const affiliateUser = await prisma.user.upsert({
    where: { email: 'affiliate@nabrijan.com' },
    update: {},
    create: {
      name: 'Mehedi Hasan Promoter',
      email: 'affiliate@nabrijan.com',
      phone: '+8801900000002',
      passwordHash: hashedPassword,
      defaultRole: 'AFFILIATE',
      userRoles: {
        create: [
          { roleId: roleMap.AFFILIATE },
          { roleId: roleMap.CUSTOMER },
        ],
      },
      affiliate: {
        create: {
          referralCode: 'MEHEDI2026',
          commissionEarned: 2450.0,
          payoutMethod: 'bKash',
        },
      },
    },
  });

  // 9. Create 50+ Products with Images & Variants
  console.log('📦 Creating 50+ products with variants and inventory...');

  const productTemplates = [
    { title: 'Walton Primo GH10 Smartphone 4GB/64GB', categoryIdx: 0, brandIdx: 0, price: 12500, salePrice: 11490 },
    { title: 'Samsung Galaxy A15 5G (Official Warranty)', categoryIdx: 0, brandIdx: 3, price: 21990, salePrice: 19990 },
    { title: 'Xiaomi Redmi Note 13 Bangladesh Edition', categoryIdx: 0, brandIdx: 4, price: 22990, salePrice: 20990 },
    { title: 'Wireless Bluetooth Earbuds Pro Bass', categoryIdx: 0, brandIdx: 4, price: 1850, salePrice: 1490 },
    { title: 'Vision Smart Android LED TV 43 Inch', categoryIdx: 0, brandIdx: 9, price: 34500, salePrice: 31900 },
    { title: 'Walton Inverter Split Air Conditioner 1.5 Ton', categoryIdx: 0, brandIdx: 0, price: 48900, salePrice: 45500 },

    { title: 'Handloom Cotton Panjabi for Men (Eid Special)', categoryIdx: 1, brandIdx: 2, price: 3200, salePrice: 2800 },
    { title: 'Aarong Silk Saree with Zari Embroidery', categoryIdx: 1, brandIdx: 2, price: 8500, salePrice: 7900 },
    { title: 'Apex Genuine Leather Formal Shoes for Men', categoryIdx: 1, brandIdx: 1, price: 4200, salePrice: 3790 },
    { title: 'Bata Comfortable Casual Sneakers', categoryIdx: 1, brandIdx: 7, price: 2990, salePrice: 2490 },
    { title: 'Richman Premium Cotton Slim Fit Shirt', categoryIdx: 1, brandIdx: 8, price: 2450, salePrice: 1990 },

    { title: 'Non-stick Aluminum 5-Piece Cookware Set', categoryIdx: 2, brandIdx: 0, price: 4500, salePrice: 3890 },
    { title: 'Electric Rice Cooker 2.8 Liters Stainless Inner Pot', categoryIdx: 2, brandIdx: 9, price: 3200, salePrice: 2750 },
    { title: 'Handcrafted Jute Carpet & Rug (Home Decor)', categoryIdx: 2, brandIdx: 2, price: 1850, salePrice: 1450 },

    { title: 'Square Herbal Aloe Vera Skin Care Lotion', categoryIdx: 3, brandIdx: 6, price: 450, salePrice: 390 },
    { title: 'Organic Neem Cleansing Face Wash 150ml', categoryIdx: 3, brandIdx: 6, price: 350, salePrice: 290 },

    { title: 'Pran Premium Miniket Rice 25KG Bag', categoryIdx: 4, brandIdx: 5, price: 1750, salePrice: 1680 },
    { title: 'Pure Mustard Oil (Shorishar Tel) 5 Liters', categoryIdx: 4, brandIdx: 5, price: 1150, salePrice: 1050 },
    { title: 'Organic Sylhet Black Tea 500g Pack', categoryIdx: 4, brandIdx: 6, price: 320, salePrice: 280 },

    { title: 'Baby Educational Wooden Puzzle Board Set', categoryIdx: 5, brandIdx: 2, price: 950, salePrice: 790 },
    { title: 'Newborn Organic Cotton Clothing Gift Box', categoryIdx: 5, brandIdx: 2, price: 1450, salePrice: 1250 },
  ];

  let productCount = 0;

  for (let cycle = 1; cycle <= 3; cycle++) {
    for (let pIdx = 0; pIdx < productTemplates.length; pIdx++) {
      productCount++;
      const tpl = productTemplates[pIdx];
      const storeId = storeIds[(productCount - 1) % storeIds.length];
      const categoryId = categoryIds[tpl.categoryIdx % categoryIds.length];
      const brandId = brandIds[tpl.brandIdx % brandIds.length];

      const slug = `${tpl.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${productCount}`;
      const sku = `NBD-SKU-${10000 + productCount}`;

      const createdProduct = await prisma.product.create({
        data: {
          storeId,
          categoryId,
          brandId,
          title: cycle > 1 ? `${tpl.title} (Batch #${cycle})` : tpl.title,
          slug,
          description: `High quality Bangladesh authentic product. Fully verified by vendor. Warranty and fast local delivery available across 64 districts.`,
          basePrice: tpl.price,
          salePrice: tpl.salePrice,
          stockQuantity: 50 + (productCount * 5),
          sku,
          status: ProductStatus.ACTIVE,
          isFeatured: productCount % 4 === 0,
          images: {
            create: [
              { url: `https://picsum.photos/seed/${slug}-1/600/600`, isPrimary: true, sortOrder: 1 },
              { url: `https://picsum.photos/seed/${slug}-2/600/600`, isPrimary: false, sortOrder: 2 },
            ],
          },
          variants: {
            create: [
              { name: 'Standard / Default', sku: `${sku}-STD`, price: tpl.salePrice || tpl.price, stockQuantity: 30 },
              { name: 'Premium Edition', sku: `${sku}-PRM`, price: (tpl.salePrice || tpl.price) + 200, stockQuantity: 20 },
            ],
          },
        },
      });

      // Add a sample review
      await prisma.review.create({
        data: {
          userId: customerUser.id,
          productId: createdProduct.id,
          rating: 4 + (productCount % 2),
          comment: 'Extremely fast delivery and original BD brand quality! Recommended.',
        },
      });
    }
  }

  // 10. Create Sample Cart & Sample Order
  const sampleProduct = await prisma.product.findFirst({ where: { status: 'ACTIVE' } });
  if (sampleProduct) {
    const cart = await prisma.cart.create({
      data: {
        userId: customerUser.id,
        items: {
          create: {
            productId: sampleProduct.id,
            quantity: 2,
            priceAtAdd: sampleProduct.salePrice || sampleProduct.basePrice,
          },
        },
      },
    });

    const sampleOrder = await prisma.order.create({
      data: {
        orderNumber: 'NBD-ORD-2026-00001',
        buyerId: customerUser.id,
        storeId: sampleProduct.storeId,
        subtotal: (sampleProduct.salePrice || sampleProduct.basePrice) * 2,
        shippingFee: 120.0,
        taxAmount: 0.0,
        discountAmount: 50.0,
        totalAmount: ((sampleProduct.salePrice || sampleProduct.basePrice) * 2) + 120.0 - 50.0,
        paymentStatus: 'PAID',
        orderStatus: 'PROCESSING',
        paymentMethod: PaymentMethod.BKASH,
        shippingAddressJson: JSON.stringify({
          fullName: 'Sajid Rahman',
          phone: '+8801900000001',
          division: 'Dhaka',
          district: 'Dhaka',
          upazila: 'Dhanmondi',
          address: 'Dhanmondi 27, Road 27, House 4A',
        }),
        items: {
          create: {
            productId: sampleProduct.id,
            title: sampleProduct.title,
            price: sampleProduct.salePrice || sampleProduct.basePrice,
            quantity: 2,
            totalAmount: (sampleProduct.salePrice || sampleProduct.basePrice) * 2,
          },
        },
        events: {
          create: [
            { status: 'PENDING', notes: 'Order placed by customer via bKash' },
            { status: 'PROCESSING', notes: 'Payment verified and sent to vendor' },
          ],
        },
        payments: {
          create: {
            amount: ((sampleProduct.salePrice || sampleProduct.basePrice) * 2) + 120.0 - 50.0,
            method: PaymentMethod.BKASH,
            status: 'PAID',
            providerTxnId: 'TRX99882211BD',
          },
        },
        shipments: {
          create: {
            trackingCode: 'NBD-TRK-887711',
            courierName: 'NABRIJAN_EXPRESS',
            status: 'IN_TRANSIT',
            estimatedDelivery: new Date(Date.now() + 86400000 * 2),
          },
        },
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: customerUser.id,
        action: 'ORDER_PLACED',
        entity: 'Order',
        entityId: sampleOrder.id,
        metadata: JSON.stringify({ orderNumber: 'NBD-ORD-2026-00001', totalAmount: sampleOrder.totalAmount }),
      },
    });
  }

  // 11. System Settings
  await prisma.systemSetting.upsert({
    where: { key: 'PLATFORM_COMMISSION_RATE' },
    update: {},
    create: {
      key: 'PLATFORM_COMMISSION_RATE',
      value: '5.0',
      description: 'Default vendor commission rate percentage',
    },
  });

  await prisma.systemSetting.upsert({
    where: { key: 'PLATFORM_CURRENCY' },
    update: {},
    create: {
      key: 'PLATFORM_CURRENCY',
      value: 'BDT',
      description: 'Primary platform currency',
    },
  });

  console.log(`✅ Seed completed successfully! Created ${productCount} products across ${storeIds.length} stores.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
