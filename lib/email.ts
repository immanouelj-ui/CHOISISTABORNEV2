import { Resend } from "resend";

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "CHOISISTABORNE <onboarding@resend.dev>";

function getClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function welcomeEmailHtml(name: string) {
  const firstName = name.trim().split(" ")[0] || "";
  return `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #121418;">
      <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #6b7280;">CHOISISTABORNE</p>
      <h1 style="font-size: 24px; font-weight: 500; margin: 12px 0 20px;">Bienvenue${firstName ? " " + firstName : ""} !</h1>
      <p style="font-size: 15px; line-height: 1.6;">
        Votre compte CHOISISTABORNE est bien créé. Vous pouvez désormais suivre vos commandes,
        retrouver votre panier d'une visite à l'autre et accéder plus rapidement à votre espace client.
      </p>
      <p style="margin: 28px 0;">
        <a href="https://www.choisistaborne.fr/produits" style="background: #121418; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-size: 14px; font-weight: 600;">
          Découvrir les bornes de recharge
        </a>
      </p>
      <p style="font-size: 13px; color: #6b7280; line-height: 1.6;">
        Une question sur l'installation ou le choix de votre borne ?
        <a href="https://www.choisistaborne.fr/contact" style="color: #121418;">Contactez-nous</a> depuis le site.
      </p>
      <p style="margin-top: 24px; font-size: 11px; color: #9ca3af; line-height: 1.5;">
        Cet e-mail est envoyé automatiquement, merci de ne pas y répondre directement.
      </p>
    </div>
  `;
}

export async function sendWelcomeEmail(input: { to: string; name: string }) {
  const client = getClient();
  if (!client) {
    console.warn("RESEND_API_KEY is not configured — welcome email skipped");
    return;
  }

  try {
    await client.emails.send({
      from: FROM_ADDRESS,
      to: input.to,
      subject: "Bienvenue chez CHOISISTABORNE",
      html: welcomeEmailHtml(input.name),
    });
  } catch (error) {
    console.error("WELCOME_EMAIL_ERROR", error);
  }
}
