import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const store = await prisma.store.findFirst({
      where: { ownerId: session.userId },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        banner: true,
        description: true,
        businessType: true,
        status: true,
        rejectionReason: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ store });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      businessType,
      taxId,
      tradeLicenseNumber,
      nidNumber,
      verificationDocs,
      isDraft,
    } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Store name and unique store URL slug are required.' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // Check slug uniqueness across existing stores
    const existingStore = await prisma.store.findUnique({ where: { slug: cleanSlug } });
    if (existingStore && existingStore.ownerId !== session.userId) {
      return NextResponse.json({ error: 'Store URL slug is already taken. Please choose another.' }, { status: 400 });
    }

    const currentStatus = isDraft ? 'DRAFT' : 'UNDER_REVIEW';

    let store = await prisma.store.findFirst({ where: { ownerId: session.userId } });

    if (store) {
      store = await prisma.store.update({
        where: { id: store.id },
        data: {
          name,
          slug: cleanSlug,
          description,
          businessType,
          taxId,
          tradeLicenseNumber,
          nidNumber,
          verificationDocsJson: verificationDocs ? JSON.stringify(verificationDocs) : null,
          status: currentStatus,
        },
      });
    } else {
      store = await prisma.store.create({
        data: {
          ownerId: session.userId,
          name,
          slug: cleanSlug,
          description,
          businessType,
          taxId,
          tradeLicenseNumber,
          nidNumber,
          verificationDocsJson: verificationDocs ? JSON.stringify(verificationDocs) : null,
          status: currentStatus,
        },
      });
    }

    // Ensure user has SELLER role capability
    const sellerRole = await prisma.role.findUnique({ where: { name: 'SELLER' } });
    if (sellerRole) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: session.userId, roleId: sellerRole.id } },
        update: {},
        create: { userId: session.userId, roleId: sellerRole.id },
      });
    }

    await createAuditLog({
      userId: session.userId,
      action: isDraft ? 'SELLER_ONBOARDING_DRAFT' : 'SELLER_ONBOARDING_SUBMITTED',
      entity: 'Store',
      entityId: store.id,
    });

    return NextResponse.json({ success: true, store });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Onboarding submission failed' }, { status: 500 });
  }
}
