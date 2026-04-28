/** PayPal live (production) — client id is public in the browser; keep secrets in backend. */
export const PAYPAL_LIVE_CLIENT_ID =
  import.meta.env.VITE_PAYPAL_CLIENT_ID ??
  "AcPVWQqIGELYBh2o0JuEJHhuZ-1u4gwa17GXZNnLLc1XluWjO1HD0Ffffv84K5stUgl4aQ58lh6lhDRZWCGzy1k1_D933aZEMEV";

/** Set to your n8n workflow webhook URL, e.g. `https://tu-dominio.app.n8n.cloud/webhook/...` */
export const N8N_PAYMENT_WEBHOOK_URL =
  import.meta.env.VITE_N8N_PAYMENT_WEBHOOK ??
  "https://empresatecnologica.app.n8n.cloud/webhook-test/130b612a-4c61-40a1-ac26-dfe16f93b785";

export const paypalScriptOptions = {
  clientId: PAYPAL_LIVE_CLIENT_ID,
  currency: "USD" as const,
  intent: "capture" as const,
  environment: "production" as const,
};
