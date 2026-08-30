export interface ShipmentRequest {
  orderId: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  district: string;
  thana: string;
  itemWeightKg: number;
  codAmount: number;
}

export interface ShippingRateRequest {
  originDistrict: string;
  destinationDistrict: string;
  weightKg: number;
}

export interface CourierProvider {
  name: string;
  calculateRate(request: ShippingRateRequest): Promise<{ deliveryFee: number; estimatedDays: string }>;
  createShipment(request: ShipmentRequest): Promise<{ trackingCode: string; status: string }>;
  trackShipment(trackingCode: string): Promise<{ status: string; history: any[] }>;
  cancelShipment(trackingCode: string): Promise<boolean>;
}

export class PathaoCourierAdapter implements CourierProvider {
  name = 'Pathao Courier';

  async calculateRate(request: ShippingRateRequest) {
    const isInsideDhaka = request.destinationDistrict.toLowerCase().includes('dhaka');
    const baseFee = isInsideDhaka ? 60 : 120;
    const extraWeight = Math.max(0, Math.ceil(request.weightKg - 1)) * 20;
    return {
      deliveryFee: baseFee + extraWeight,
      estimatedDays: isInsideDhaka ? '1-2 Days' : '2-4 Days',
    };
  }

  async createShipment(request: ShipmentRequest) {
    const trackingCode = `PTH-${Date.now().toString().slice(-6)}`;
    console.log(`[Pathao Courier] Created shipment ${trackingCode} for order #${request.orderId}`);
    return { trackingCode, status: 'DISPATCHED' };
  }

  async trackShipment(trackingCode: string) {
    return {
      status: 'IN_TRANSIT',
      history: [{ status: 'PICKED_UP', timestamp: new Date() }],
    };
  }

  async cancelShipment(trackingCode: string) {
    console.log(`[Pathao Courier] Cancelled shipment ${trackingCode}`);
    return true;
  }
}

export class SteadfastCourierAdapter implements CourierProvider {
  name = 'Steadfast Courier';

  async calculateRate(request: ShippingRateRequest) {
    const isInsideDhaka = request.destinationDistrict.toLowerCase().includes('dhaka');
    return {
      deliveryFee: isInsideDhaka ? 70 : 130,
      estimatedDays: isInsideDhaka ? '1-2 Days' : '3-5 Days',
    };
  }

  async createShipment(request: ShipmentRequest) {
    const trackingCode = `STDF-${Date.now().toString().slice(-6)}`;
    return { trackingCode, status: 'DISPATCHED' };
  }

  async trackShipment(trackingCode: string) {
    return { status: 'DISPATCHED', history: [] };
  }

  async cancelShipment(trackingCode: string) {
    return true;
  }
}

export class CourierEngine {
  private adapters: Record<string, CourierProvider> = {
    PATHAO: new PathaoCourierAdapter(),
    STEADFAST: new SteadfastCourierAdapter(),
  };

  getProvider(name: string = 'PATHAO'): CourierProvider {
    return this.adapters[name.toUpperCase()] || this.adapters.PATHAO;
  }
}

export const courierEngine = new CourierEngine();
