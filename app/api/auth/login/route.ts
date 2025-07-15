import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");

  if (!shop) return NextResponse.json({ error: "Missing shop param" }, { status: 400 });

  const redirectUri = `${process.env.HOST}/api/auth/callback`;
  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_SHOPIFY_API_KEY}&scope=${process.env.SHOPIFY_SCOPES}&redirect_uri=${redirectUri}`;

  return NextResponse.redirect(installUrl);
}
