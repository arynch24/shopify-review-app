import { NextResponse } from 'next/server';

export async function GET() {
  const js = `
    (async function() {
      const container = document.getElementById("my-reviews-widget");
      const shop = container?.dataset.shop;
      const productId = container?.dataset.productId;
      if (!shop || !productId) return;

      // ABSOLUTE URL - FIXED
      const res = await fetch("https://229ff28f431c.ngrok-free.app/api/reviews?shop=" + shop + "&product=" + productId);
      let data = [];
      try {
        data = await res.json();
        if (!Array.isArray(data)) data = [];
      } catch (e) {
        console.error("Failed to load reviews", e);
      }

      const list = document.createElement('div');
      list.style.border = '1px solid #ddd';
      list.style.padding = '10px';
      list.style.marginTop = '10px';

      data.forEach(r => {
        const el = document.createElement('div');
        el.innerHTML = \`<strong>\${'⭐'.repeat(Number(r.rating))}</strong><br/>\${r.comment}<br/><em>\${r.customer}</em><hr/>\`;
        list.appendChild(el);
      });

      const form = document.createElement('form');
      form.innerHTML = \`
        <input name="customer" placeholder="Your Name" required /><br/>
        <input name="rating" type="number" min="1" max="5" required /><br/>
        <textarea name="comment" placeholder="Your Review" required></textarea><br/>
        <input type="hidden" name="shop" value="\${shop}" />
        <input type="hidden" name="productId" value="\${productId}" />
        <button type="submit">Submit Review</button>
      \`;

      form.onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const obj = Object.fromEntries(fd.entries());

        await fetch("https://229ff28f431c.ngrok-free.app/api/reviews/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(obj),
        });

        alert("Thank you for your review!");
        form.reset();
      };

      container.appendChild(list);
      container.appendChild(form);
    })();
  `;

  return new NextResponse(js, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Access-Control-Allow-Origin': '*', // Or restrict to specific domains like 'https://mystore.myshopify.com'
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    },
  });
}
