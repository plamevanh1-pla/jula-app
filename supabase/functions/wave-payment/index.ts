// supabase/functions/wave-payment/index.ts

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req: Request) => {
  try {
    const { order_id, amount } = await req.json();

    const response = await fetch(
      "https://api.wave.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer YOUR_WAVE_SECRET_KEY`,
        },
        body: JSON.stringify({
          amount,
          currency: "XOF",
          client_reference: order_id,
          success_url: "myapp://success",
          error_url: "myapp://error",
        }),
      }
    );

    const data = await response.json();

    return new Response(
      JSON.stringify({
        checkout_url: data.checkout_url,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});