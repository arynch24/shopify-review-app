import { PrismaClient } from '@/app/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get('shop');
  const productId = searchParams.get('product');

  if (!shop || !productId) {
    return NextResponse.json([], { status: 200 });
  }

  const shopRecord = await prisma.shop.findUnique({ where: { shop } });
  if (!shopRecord) {
    return NextResponse.json([], { status: 200 });
  }

  const reviews = await prisma.review.findMany({
    where: { shopId: shopRecord.id, productId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(reviews);
}
