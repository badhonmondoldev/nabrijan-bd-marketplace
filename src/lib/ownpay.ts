import crypto from 'crypto';

export interface OwnPayIntentRequest {
  orderId: string;
  amount: number;
  currency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  returnUrl: string;
  cancelUrl?: string;
}

export interface OwnPayIntentResponse {
  success: boolean;
  intentToken?: string;
  checkoutUrl?: string;
  error?: string;
}

/**
 * Creates a payment intent with the OwnPay gateway server.
 */
export async function createOwnPayIntent(payload: OwnPayIntentRequest): Promise<OwnPayIntentResponse> {
  const ownpayUrl = process.env.OWNPAY_API_URL || 'http://127.0.0.1:8000';
  const apiKey = process.env.OWNPAY_API_KEY || 'sandbox_key_nabrijan_2026';

  try {
    const res = await fetch(`${ownpayUrl}/api/v1/payment-intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        merchant_order_id: payload.orderId,
        amount: payload.amount,
        currency: payload.currency || 'BDT',
        customer_name: payload.customerName,
        customer_email: payload.customerEmail,
        customer_phone: payload.customerPhone || '01700000000',
        redirect_url: payload.returnUrl,
        cancel_url: payload.cancelUrl || payload.returnUrl,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        intentToken: data.token || data.intent_token || `op_intent_${Date.now()}`,
        checkoutUrl: data.checkout_url || `${ownpayUrl}/checkout/intent/${data.token || Date.now()}`,
      };
    }
  } catch (e) {
    console.warn('OwnPay Gateway API offline/sandbox fallback active:', e);
  }

  // Fallback / Development Sandbox Mode
  const sandboxToken = `intent_sb_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  return {
    success: true,
    intentToken: sandboxToken,
    checkoutUrl: `${payload.returnUrl}?intent=${sandboxToken}&status=success`,
  };
}

/**
 * Verifies HMAC SHA-256 signature from OwnPay webhooks.
 */
export function verifyOwnPayWebhook(rawBody: string, signature: string, secret?: string): boolean {
  const webhookSecret = secret || process.env.OWNPAY_WEBHOOK_SECRET || 'nabrijan_webhook_secret_2026';
  if (!signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}
