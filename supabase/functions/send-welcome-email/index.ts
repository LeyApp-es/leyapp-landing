import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface WaitlistRecord {
  email: string;
  language: string;
  source?: string;
}

interface WebhookPayload {
  type: "INSERT";
  table: string;
  record: WaitlistRecord;
  schema: "public";
  old_record: null | WaitlistRecord;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    const payload: WebhookPayload = await req.json();
    const { record } = payload;

    // Validations
    if (!record || !record.email) {
      console.error("No record or email found in payload");
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return new Response(JSON.stringify({ error: "Server misconfiguration" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Customize content based on language
    const lang = record.language || 'es';

    // Define translations for subjects
    const subjects: Record<string, string> = {
      es: "¡Estás en la lista! Bienvenido a LeyApp 🚀",
      en: "You're on the waitlist! Welcome to LeyApp 🚀",
      fr: "Vous êtes sur la liste d'attente ! Bienvenue chez LeyApp 🚀",
      ar: "أنت في قائمة الانتظار! مرحباً بك في LeyApp 🚀",
    };

    // Define content for emails
    const content: Record<string, any> = {
      es: {
        title: "¡Gracias por unirte!",
        badge: "✨ Registro Confirmado",
        p1: "Hemos recibido tu solicitud para unirte a la lista de espera de <strong>LeyApp</strong> en Barcelona. Nos alegra mucho que confíes en nosotros.",
        p2: "Nuestro equipo está trabajando duro para verificar a los mejores abogados y preparar la plataforma para ti.",
        listTitle: "Serás de los primeros en recibir:",
        items: [
          "Acceso anticipado a la plataforma",
          "Descuentos exclusivos en tu primera consulta",
          "Guías gratuitas sobre trámites legales"
        ],
        btn: "Visitar Sitio Web",
        footer: "© 2026 LeyApp - Conectando extranjeros con abogados de confianza."
      },
      en: {
        title: "Thanks for joining!",
        badge: "✨ Registration Confirmed",
        p1: "We have received your request to join the <strong>LeyApp</strong> waitlist in Barcelona. We are thrilled to have you.",
        p2: "Our team is working hard to verify the best immigration lawyers and prepare the platform for you.",
        listTitle: "You'll be among the first to get:",
        items: [
          "Early access to the platform",
          "Exclusive discounts on your first consultation",
          "Free guides on immigration procedures"
        ],
        btn: "Visit Website",
        footer: "© 2026 LeyApp - Connecting foreigners with trusted lawyers."
      },
      fr: {
        title: "Merci de nous avoir rejoints !",
        badge: "✨ Inscription Confirmée",
        p1: "Nous avons bien reçu votre demande pour rejoindre la liste d'attente de <strong>LeyApp</strong> à Barcelone.",
        p2: "Notre équipe travaille dur pour vérifier les meilleurs avocats en immigration et préparer la plateforme pour vous.",
        listTitle: "Vous recevrez en premier :",
        items: [
          "Accès anticipé à la plateforme",
          "Réductions exclusives sur votre première consultation",
          "Guides gratuits sur les procédures d'immigration"
        ],
        btn: "Visiter le site",
        footer: "© 2026 LeyApp - Connecter les étrangers avec des avocats de confiance."
      },
      ar: {
        title: "شكراً لانضمامك!",
        badge: "✨ تم تأكيد التسجيل",
        p1: "لقد تلقينا طلبك للانضمام إلى قائمة انتظار <strong>LeyApp</strong> في برشلونة.",
        p2: "يعمل فريقنا بجد للتحقق من أفضل محامي الهجرة وإعداد المنصة لك.",
        listTitle: "ستكون من بين الأوائل للحصول على:",
        items: [
          "وصول مبكر للمنصة",
          "خصومات حصرية على استشارتك الأولى",
          "أدلة مجانية حول إجراءات الهجرة"
        ],
        btn: "زيارة الموقع",
        footer: "© 2026 LeyApp - ربط الأجانب بمحامين موثوقين."
      }
    };

    // Fallback logic
    const t = content[lang] || content['es'];
    const subject = subjects[lang] || subjects['es'];
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    // HTML Template
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="${lang}" dir="${dir}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <center style="width: 100%; table-layout: fixed; background-color: #f3f4f6; padding-bottom: 40px;">
        <div style="height: 40px;"></div>
        <table style="background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #1a0f2e; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
            <td style="background: linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%); padding: 30px 20px; text-align: center;">
              <img src="https://leyapp.es/leyapp-logo-blue.png" alt="LeyApp" width="80" style="max-width: 80px; height: auto; border: 0;">
            </td>
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <div style="text-align: center;">
                <div style="display: inline-block; padding: 6px 12px; background-color: rgba(45, 212, 191, 0.1); color: #0f766e; border-radius: 99px; font-size: 14px; font-weight: 600; margin-bottom: 20px; border: 1px solid rgba(45, 212, 191, 0.3);">
                  ${t.badge}
                </div>
              </div>
              <h1 style="font-size: 24px; margin: 0 0 20px; color: #1a0f2e; font-weight: 700; text-align: center;">
                ${t.title}
              </h1>
              <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 20px;">
                ${t.p1}
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 20px;">
                ${t.p2}
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #1a0f2e; font-weight: 600; margin-bottom: 10px;">
                ${t.listTitle}
              </p>
              <ul style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 30px; padding-${dir === 'rtl' ? 'right' : 'left'}: 20px;">
                ${t.items.map((item: string) => `<li style="margin-bottom: 10px;">${item}</li>`).join('')}
              </ul>
        <div style="text-align: center;">
            <a href="https://leyapp.es?lang=${lang}" style="display: inline-block; background: linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 16px; margin-top: 10px; box-shadow: 0 4px 14px rgba(45, 212, 191, 0.3);">
                ${t.btn}
            </a>
        </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 12px; color: #9ca3af; margin-bottom: 10px;">${t.footer}</p>
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">Barcelone, Spain 🇪🇸</p>
            </td>
          </tr>
        </table>
        <div style="height: 40px;"></div>
      </center>
    </body>
    </html>
    `;

    // Send Email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LeyApp <hello@leyapp.es>", // Make sure to verify domain in Resend
        to: [record.email],
        subject: subject,
        html: htmlContent,
      }),
    });

    const data = await res.json();
    console.log("Email sent result:", data);

    return new Response(JSON.stringify(data), {
      status: res.ok ? 200 : res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

serve(handler);
