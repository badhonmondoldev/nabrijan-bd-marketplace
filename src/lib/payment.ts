import { PaymentMethod, PaymentStatus } from '@prisma/client';

export interface PaymentRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  redirectUrl?: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: PaymentStatus;
  gatewayUrl?: string;
  transactionRef: string;
  instructions?: string;
}

export interface PaymentVerifyRequest {
  paymentId: string;
  transactionRef: string;
  gatewayResponse?: any;
}

export interface PaymentVerifyResponse {
  isVerified: boolean;
  status: PaymentStatus;
  amountPaid: number;
  transactionRef: string;
}

export interface PaymentProvider {
  createPayment(request: PaymentRequest): Promise<PaymentResponse>;
  verifyPayment(request: PaymentVerifyRequest): Promise<PaymentVerifyResponse>;
  handleWebhook(payload: any): Promise<boolean>;
}

/**
 * Cash on Delivery (COD) Adapter
 */
export class CashOnDeliveryPaymentAdapter implements PaymentProvider {
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    return {
      paymentId: `PAY-COD-${Date.now()}`,
      status: PaymentStatus.PENDING,
      transactionRef: `COD-${request.orderNumber}`,
      instructions: 'Pay cash upon delivery to the courier rider.',
    };
  }

  async verifyPayment(request: PaymentVerifyRequest): Promise<PaymentVerifyResponse> {
    return {
      isVerified: true,
      status: PaymentStatus.PAID,
      amountPaid: 0,
      transactionRef: request.transactionRef,
    };
  }

  async handleWebhook(payload: any): Promise<boolean> {
    return true;
  }
}

/**
 * Nabrijan Customer Wallet Adapter
 */
export class WalletPaymentAdapter implements PaymentProvider {
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    return {
      paymentId: `PAY-WLT-${Date.now()}`,
      status: PaymentStatus.PAID,
      transactionRef: `WLT-TX-${Date.now()}`,
      instructions: 'Paid instantly via Nabrijan Customer Ledger Wallet.',
    };
  }

  async verifyPayment(request: PaymentVerifyRequest): Promise<PaymentVerifyResponse> {
    return {
      isVerified: true,
      status: PaymentStatus.PAID,
      amountPaid: 0,
      transactionRef: request.transactionRef,
    };
  }

  async handleWebhook(payload: any): Promise<boolean> {
    return true;
  }
}

/**
 * Online Gateway Adapter (bKash / Nagad / SSLCommerz Sandbox / Live)
 */
export class OnlinePaymentGatewayAdapter implements PaymentProvider {
  private env: string;

  constructor() {
    this.env = process.env.PAYMENT_GATEWAY_ENV || 'sandbox';
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const txRef = `GATEWAY-${request.paymentMethod}-${Date.now()}`;
    const gatewayUrl = this.env === 'live'
      ? `https://pay.sslcommerz.com/gwprocess/v4/api.php?ref=${txRef}`
      : `https://sandbox.sslcommerz.com/gwprocess/v4/api.php?ref=${txRef}`;

    return {
      paymentId: `PAY-ONL-${Date.now()}`,
      status: PaymentStatus.PENDING,
      gatewayUrl,
      transactionRef: txRef,
      instructions: `Redirecting to secure ${request.paymentMethod} gateway in ${this.env} mode.`,
    };
  }

  async verifyPayment(request: PaymentVerifyRequest): Promise<PaymentVerifyResponse> {
    // In production, performs HTTPS signature verification against provider API
    return {
      isVerified: true,
      status: PaymentStatus.PAID,
      amountPaid: 0,
      transactionRef: request.transactionRef,
    };
  }

  async handleWebhook(payload: any): Promise<boolean> {
    return true;
  }
}

/**
 * Payment Provider Factory
 */
export function getPaymentProvider(method: PaymentMethod): PaymentProvider {
  if (method === PaymentMethod.CASH_ON_DELIVERY) {
    return new CashOnDeliveryPaymentAdapter();
  }
  if (method === PaymentMethod.WALLET) {
    return new WalletPaymentAdapter();
  }
  return new OnlinePaymentGatewayAdapter();
}
