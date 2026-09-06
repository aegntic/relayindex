const stripePaymentLinkHost = "buy.stripe.com";

export function validateCheckoutUrl(value: string | undefined | null) {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.hostname.toLowerCase() !== stripePaymentLinkHost) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function configuredCheckoutUrl() {
  return validateCheckoutUrl(process.env.NEXT_PUBLIC_RELAY_PILOT_CHECKOUT_URL);
}
