import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@/app/generated/prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");
  const code = searchParams.get("code");

  console.log("🔁 OAuth Callback Received", { shop, code });

  if (!shop || !code) {
    return NextResponse.json({ error: "Missing shop or code" }, { status: 400 });
  }

  try {
    const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }),
    });

    const text = await tokenRes.text(); // RAW TEXT
    console.log("🧾 Token response:", text);

    const data = JSON.parse(text);
    const access_token = data.access_token;

    if (!access_token) {
      console.error("❌ No access_token found:", data);
      return NextResponse.json({ error: "Access token missing in response" }, { status: 500 });
    }

    await prisma.shop.upsert({
      where: { shop },
      update: { accessToken: access_token },
      create: { shop, accessToken: access_token },
    });

    return NextResponse.redirect(`${process.env.HOST}/dashboard?shop=${shop}`);
  } catch (err: any) {
    console.error("❌ OAuth callback failed:", err);
    return NextResponse.json({ error: "OAuth callback error" }, { status: 500 });
  }
}
