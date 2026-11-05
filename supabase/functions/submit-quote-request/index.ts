import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const COMMUNES = [
  "Achenheim", "Bischheim", "Blaesheim", "Breuschwickersheim", "Eckbolsheim", "Eckwersheim",
  "Entzheim", "Eschau", "Fegersheim", "Geispolsheim", "Hangenbieten", "Hœnheim", "Holtzheim",
  "Illkirch-Graffenstaden", "Kolbsheim", "La Wantzenau", "Lampertheim", "Lingolsheim", "Lipsheim",
  "Mittelhausbergen", "Mundolsheim", "Niederhausbergen", "Oberhausbergen", "Oberschaeffolsheim",
  "Osthoffen", "Ostwald", "Plobsheim", "Reichstett", "Schiltigheim", "Souffelweyersheim",
  "Strasbourg", "Vendenheim", "Wolfisheim",
];

const SERVICES = ["Vitres et vitrines", "Bureaux et espaces communs", "Remise en état après déménagement"];

const PROPERTY_LABELS: Record<string, string> = {
  appartement: "Appartement",
  maison: "Maison",
  bureaux: "Bureaux",
  commerce: "Commerce ou boutique",
  espaces_communs: "Espaces communs (immeuble, copropriété)",
  locaux_activite: "Local d'activité",
  autre: "Autre",
};

const FREQUENCY_LABELS: Record<string, string> = {
  ponctuelle: "Ponctuelle (une seule fois)",
  hebdomadaire: "Chaque semaine",
  bihebdomadaire: "Deux fois par semaine",
  quotidienne: "Chaque jour",
  mensuelle: "Chaque mois",
  a_definir: "Je ne sais pas encore",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type QuoteRecord = {
  client_type: "particulier" | "professionnel";
  full_name: string;
  email: string;
  phone: string;
  city: string;
  services: string[];
  property_type: string | null;
  surface_m2: number | null;
  preferred_date: string | null;
  message: string | null;
  company_name: string | null;
  siret: string | null;
  frequency: string | null;
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function text(value: unknown, min: number, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length >= min && trimmed.length <= max ? trimmed : null;
}

function optionalText(value: unknown, max: number): string | null {
  if (value === null || value === undefined || value === "") return null;
  return text(value, 1, max);
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function parseQuote(input: Record<string, unknown>): QuoteRecord | string {
  const clientType = oneOf(input.client_type, ["particulier", "professionnel"] as const);
  if (!clientType) return "Type de demande invalide.";

  const fullName = text(input.full_name, 2, 120);
  if (!fullName) return "Le nom est invalide.";

  const email = text(input.email, 5, 200);
  if (!email || !EMAIL_PATTERN.test(email)) return "L'adresse e-mail est invalide.";

  const phone = text(input.phone, 6, 30);
  if (!phone) return "Le téléphone est invalide.";

  const city = oneOf(input.city, COMMUNES);
  if (!city) return "La commune n'est pas dans la zone d'intervention.";

  if (!Array.isArray(input.services) || input.services.length < 1 || input.services.length > 3) {
    return "Les prestations sont invalides.";
  }
  const services = input.services.map((service) => oneOf(service, SERVICES));
  if (services.some((service) => service === null)) return "Les prestations sont invalides.";

  const propertyType = input.property_type === null || input.property_type === undefined
    ? null
    : oneOf(input.property_type, Object.keys(PROPERTY_LABELS));
  if (propertyType === null && input.property_type) return "Le type de logement ou de locaux est invalide.";

  let surface: number | null = null;
  if (input.surface_m2 !== null && input.surface_m2 !== undefined) {
    if (!Number.isInteger(input.surface_m2) || (input.surface_m2 as number) < 1 || (input.surface_m2 as number) > 100000) {
      return "La surface est invalide.";
    }
    surface = input.surface_m2 as number;
  }

  let preferredDate: string | null = null;
  if (input.preferred_date) {
    if (typeof input.preferred_date !== "string" || !isValidDate(input.preferred_date)) {
      return "La date souhaitée est invalide.";
    }
    preferredDate = input.preferred_date;
  }

  const message = optionalText(input.message, 2000);

  let companyName: string | null = null;
  let siret: string | null = null;
  let frequency: string | null = null;
  if (clientType === "professionnel") {
    companyName = text(input.company_name, 2, 160);
    if (!companyName) return "Le nom de l'entreprise est requis.";
    const rawSiret = typeof input.siret === "string" ? input.siret.replace(/\s/g, "") : "";
    if (rawSiret) {
      if (!/^\d{14}$/.test(rawSiret)) return "Le numéro SIRET est invalide.";
      siret = rawSiret;
    }
    frequency = oneOf(input.frequency, Object.keys(FREQUENCY_LABELS));
    if (!frequency) return "La fréquence souhaitée est invalide.";
  }

  return {
    client_type: clientType,
    full_name: fullName,
    email,
    phone,
    city,
    services: services as string[],
    property_type: propertyType,
    surface_m2: surface,
    preferred_date: preferredDate,
    message,
    company_name: companyName,
    siret,
    frequency,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildRows(quote: QuoteRecord): [string, string][] {
  const isPro = quote.client_type === "professionnel";
  const rows: [string, string][] = [];
  if (isPro) rows.push(["Entreprise", quote.company_name ?? ""]);
  if (isPro && quote.siret) rows.push(["SIRET", quote.siret]);
  rows.push([isPro ? "Personne à contacter" : "Nom", quote.full_name]);
  rows.push(["E-mail", quote.email]);
  rows.push(["Téléphone", quote.phone]);
  rows.push(["Commune", quote.city]);
  if (quote.property_type) {
    rows.push([isPro ? "Type de locaux" : "Type de logement", PROPERTY_LABELS[quote.property_type] ?? quote.property_type]);
  }
  if (quote.frequency) rows.push(["Fréquence", FREQUENCY_LABELS[quote.frequency] ?? quote.frequency]);
  rows.push(["Prestations", quote.services.join(", ")]);
  if (quote.surface_m2) rows.push(["Surface", `${quote.surface_m2} m²`]);
  if (quote.preferred_date) rows.push(["Date souhaitée", quote.preferred_date]);
  if (quote.message) rows.push(["Précisions", quote.message]);
  return rows;
}

async function sendNotificationEmail(quote: QuoteRecord): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const recipient = Deno.env.get("QUOTE_RECIPIENT_EMAIL");
  if (!apiKey || !recipient) throw new Error("Email configuration missing");

  const isPro = quote.client_type === "professionnel";
  const label = isPro ? "professionnel" : "particulier";
  const rows = buildRows(quote);

  const htmlRows = rows
    .map(
      ([key, value]) =>
        `<tr><td style="padding:8px 12px;color:#475569;vertical-align:top;white-space:nowrap">${escapeHtml(key)}</td>` +
        `<td style="padding:8px 12px;color:#0f172a;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "N&A Clean <onboarding@resend.dev>",
      to: [recipient],
      reply_to: quote.email,
      subject: `Nouvelle demande de devis (${label}) : ${quote.full_name}`,
      html: `<div style="font-family:Arial,sans-serif"><h2 style="color:#0f766e">Nouvelle demande de devis ${label}</h2><table style="border-collapse:collapse;width:100%">${htmlRows}</table></div>`,
      text: rows.map(([key, value]) => `${key} : ${value}`).join("\n"),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded with status ${response.status}`);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return json({ error: "Méthode non autorisée." }, 405);
    }

    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return json({ error: "Requête invalide." }, 400);
    }

    const quote = parseQuote(body as Record<string, unknown>);
    if (typeof quote === "string") {
      return json({ error: quote }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { error: insertError } = await supabase.from("quote_requests").insert(quote);
    if (insertError) {
      console.error("Insert failed:", insertError.message);
      return json({ error: "Impossible d'enregistrer la demande." }, 500);
    }

    try {
      await sendNotificationEmail(quote);
    } catch (emailError) {
      console.error("Email failed:", emailError);
      return json({ error: "La demande est enregistrée mais la notification n'a pas pu être envoyée." }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return json({ error: "Une erreur est survenue." }, 500);
  }
});
