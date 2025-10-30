export { renderers } from '../../renderers.mjs';

const prerender = false;
async function POST({ request }) {
  try {
    const data = await request.json();
    console.log("Email notification for lead:", {
      to: "team@junkhaulerboise.com",
      from: data.contactEmail,
      name: data.contactName,
      phone: data.contactPhone,
      estimate: `$${data.estimate?.priceRange?.min} - $${data.estimate?.priceRange?.max}`
    });
    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
