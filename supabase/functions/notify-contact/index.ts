import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured');

    const ADMIN_EMAIL = Deno.env.get('ADMIN_NOTIFICATION_EMAIL');
    if (!ADMIN_EMAIL) throw new Error('ADMIN_NOTIFICATION_EMAIL is not configured');

    const { name, email, phone, subject, message } = await req.json();

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8f4ef; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
          <h2 style="color: #1a1a1a; margin: 0 0 4px;">🙏 New Contact Submission</h2>
          <p style="color: #666; margin: 0; font-size: 14px;">PilgrimWay Contact Form</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #888; width: 100px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #b8860b;">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding: 8px 0; color: #888;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>` : ''}
          <tr><td style="padding: 8px 0; color: #888;">Subject</td><td style="padding: 8px 0; font-weight: 600;">${subject}</td></tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #fafafa; border-radius: 8px; border-left: 3px solid #b8860b;">
          <p style="margin: 0 0 4px; color: #888; font-size: 12px; text-transform: uppercase;">Message</p>
          <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PilgrimWay <onboarding@resend.dev>',
        to: [ADMIN_EMAIL],
        subject: `New Contact: ${subject}`,
        html: emailHtml,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Resend API error [${res.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error sending notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
