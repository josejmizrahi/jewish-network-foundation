import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  userId: string;
  status: "verified" | "rejected";
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const payload: EmailPayload = await req.json();
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, username")
      .eq("id", payload.userId)
      .single();

    if (profileError) throw profileError;

    // Get user email
    const { data: { user }, error: userError } = await supabase.auth.admin
      .getUserById(payload.userId);

    if (userError) throw userError;

    const name = profile.full_name || profile.username || "User";
    const status = payload.status;
    
    const emailContent = {
      verified: {
        subject: "Your account has been verified! 🎉",
        html: `
          <h1>Congratulations ${name}!</h1>
          <p>Your account has been verified. You now have access to all verified member features.</p>
          <p>Thank you for being part of our community!</p>
        `
      },
      rejected: {
        subject: "Verification Status Update",
        html: `
          <h1>Hello ${name},</h1>
          <p>We've reviewed your verification request and unfortunately, we cannot verify your account at this time.</p>
          ${payload.notes ? `<p>Reviewer notes: ${payload.notes}</p>` : ''}
          <p>You can submit a new verification request with updated information.</p>
        `
      }
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Verification Team <onboarding@resend.dev>",
        to: [user.email],
        subject: emailContent[status].subject,
        html: emailContent[status].html,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to send email: ${await res.text()}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
};

serve(handler);