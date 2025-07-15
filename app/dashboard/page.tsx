import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export default async function Dashboard({ searchParams }: any) {
    const shop = searchParams.shop;
    const shopRecord = await prisma.shop.findUnique({ where: { shop } });
    const reviews = await prisma.review.findMany({
        where: { shopId: shopRecord?.id },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Reviews</h1>
            jinda hu mai
            {reviews.map((r: any) => (
                <div key={r.id} className="border p-4 mb-2 rounded">
                    <p><strong>{'⭐'.repeat(r.rating)}</strong></p>
                    <p>{r.comment}</p>
                    <p className="text-sm text-gray-500">Product ID: {r.productId}</p>
                    <p className="text-sm text-gray-500">— {r.customer}</p>
                </div>
            ))}
        </div>
    );
}