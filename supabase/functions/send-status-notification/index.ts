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

interface NotificationPayload {
  eventId: string;
  userId: string;
  type: "registration_update" | "invitation_reminder";
  status?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const payload: NotificationPayload = await req.json();

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select(`
        *,
        organizer:profiles!events_organizer_id_fkey(
          full_name,
          email_notifications
        )
      `)
      .eq("id", payload.eventId)
      .single();

    if (eventError) throw eventError;

    // Get user details
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, email_notifications")
      .eq("id", payload.userId)
      .single();

    if (profileError) throw profileError;

    // Get user email
    const { data: { user }, error: userError } = await supabase.auth.admin
      .getUserById(payload.userId);

    if (userError) throw userError;

    // Check if notifications are enabled
    const notificationPreferences = event.notification_preferences || {};
    if (!notificationPreferences[payload.type]) {
      return new Response(
        JSON.stringify({ message: "Notifications disabled for this type" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare email content based on notification type
    const emailContent = {
      registration_update: {
        subject: `Event Registration Status Update: ${event.title}`,
        html: `
          <h1>Hello ${profile.full_name},</h1>
          <p>Your registration status for "${event.title}" has been updated to: ${payload.status}</p>
          <p>Event Details:</p>
          <ul>
            <li>Date: ${new Date(event.start_time).toLocaleDateString()}</li>
            <li>Time: ${new Date(event.start_time).toLocaleTimeString()}</li>
            ${event.location ? `<li>Location: ${event.location}</li>` : ''}
          </ul>
        `
      },
      invitation_reminder: {
        subject: `Reminder: You have a pending invitation for ${event.title}`,
        html: `
          <h1>Hello ${profile.full_name},</h1>
          <p>This is a reminder that you have a pending invitation to "${event.title}".</p>
          <p>Please respond to the invitation at your earliest convenience.</p>
          <p>Event Details:</p>
          <ul>
            <li>Date: ${new Date(event.start_time).toLocaleDateString()}</li>
            <li>Time: ${new Date(event.start_time).toLocaleTimeString()}</li>
            ${event.location ? `<li>Location: ${event.location}</li>` : ''}
          </ul>
        `
      }
    };

    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Events Team <onboarding@resend.dev>",
        to: [user.email],
        subject: emailContent[payload.type].subject,
        html: emailContent[payload.type].html,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to send email: ${await res.text()}`);
    }

    // Update notification status
    if (payload.type === "registration_update") {
      await supabase
        .from("event_attendees")
        .update({
          last_notification_sent_at: new Date().toISOString(),
          notification_status: "sent"
        })
        .eq("event_id", payload.eventId)
        .eq("user_id", payload.userId);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending notification:", error);
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