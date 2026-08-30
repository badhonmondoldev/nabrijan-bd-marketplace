export type FulfillmentType = 'SELLER_FULFILLED' | 'PLATFORM_FULFILLED';

export interface FulfillmentOrderRequest {
  orderId: string;
  storeId: string;
  fulfillmentType: FulfillmentType;
  warehouseId?: string;
  items: { productId: string; quantity: number }[];
}

export class FulfillmentService {
  async processFulfillmentOrder(request: FulfillmentOrderRequest) {
    if (request.fulfillmentType === 'PLATFORM_FULFILLED') {
      console.log(`[Nabrijan Express Fulfillment] Auto-allocating order #${request.orderId} from Central Warehouse`);
      return {
        success: true,
        fulfillmentType: 'PLATFORM_FULFILLED',
        warehouseCode: 'WH-DHAKA-CENTRAL',
        status: 'ALLOCATED',
      };
    }

    console.log(`[Seller Fulfilled] Order #${request.orderId} assigned directly to Seller Merchant Store #${request.storeId}`);
    return {
      success: true,
      fulfillmentType: 'SELLER_FULFILLED',
      warehouseCode: null,
      status: 'AWAITING_SELLER_DISPATCH',
    };
  }
}

export const fulfillmentService = new FulfillmentService();
