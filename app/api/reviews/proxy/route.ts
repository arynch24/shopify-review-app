import { PrismaClient } from '@/app/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const shop = req.nextUrl.searchParams.get('shop')!;
    const productId = req.nextUrl.searchParams.get('product')!;
    const shopRecord = await prisma.shop.findUnique({ where: { shop } });
    if (!shopRecord) return NextResponse.json([]);

    const reviews = await prisma.review.findMany({
        where: { shopId: shopRecord.id, productId },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
}