import { PrismaClient } from '@/app/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get('shop');
  const productId = searchParams.get('product');

  if (!shop || !productId) {
    return new NextResponse(JSON.stringify([]), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Or restrict to Shopify store origin
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json',
      },
    });
  }

  const shopRecord = await prisma.shop.findUnique({ where: { shop } });
  if (!shopRecord) {
    return new NextResponse(JSON.stringify([]), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json',
      },
    });
  }

  const reviews = await prisma.review.findMany({
    where: { shopId: shopRecord.id, productId },
    orderBy: { createdAt: 'desc' },
  });

  return new NextResponse(JSON.stringify(reviews), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Replace * with your Shopify store domain for tighter security
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Content-Type': 'application/json',
    },
  });
}
