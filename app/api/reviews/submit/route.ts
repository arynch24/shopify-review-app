import { PrismaClient } from '@/app/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

const ALLOWED_ORIGIN = 'https://vitals-review-store.myshopify.com';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { shop, productId, customer, comment, rating } = await req.json();

    if (!shop || !productId || !customer || !comment || !rating) {
      return NextResponse.json({ error: 'Missing fields' }, {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        },
      });
    }

    const shopRecord = await prisma.shop.findUnique({ where: { shop } });

    if (!shopRecord) {
      return NextResponse.json({ error: 'Shop not found' }, {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        },
      });
    }

    await prisma.review.create({
      data: {
        shopId: shopRecord.id,
        productId,
        customer,
        comment,
        rating: parseInt(rating),
      },
    });

    return NextResponse.json(
      { message: 'Review submitted' },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        },
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        },
      }
    );
  }
}
