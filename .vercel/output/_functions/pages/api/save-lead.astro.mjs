export { renderers } from '../../renderers.mjs';

const prerender = false;
async function POST({ request }) {
  try {
    const data = await request.json();
    console.log("Lead received:", {
      contact: data.contactName,
      email: data.contactEmail,
      phone: data.contactPhone,
      city: data.city,
      estimate: data.estimate
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "Lead saved successfully"
        // id: savedLead[0].id, // Uncomment when using Supabase
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error saving lead:", error);
    return new Response(
      JSON.stringify({ error: "Failed to save lead" }),
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
