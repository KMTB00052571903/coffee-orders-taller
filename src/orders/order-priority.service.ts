import { Injectable } from '@nestjs/common';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderPriorityService {
  classify(order: OrderEntity): {
    orderId: number;
    status: string;
    quantity: number;
    priority: 'completed' | 'high' | 'medium' | 'normal';
    message: string;
  } {
    const priority =
      order.status === 'ready'
        ? 'completed'
        : order.quantity >= 4
          ? 'high'
          : order.quantity >= 2
            ? 'medium'
            : 'normal';

    const message =
      priority === 'completed'
        ? 'Order is ready'
        : priority === 'high'
          ? 'Prepare this order soon'
          : priority === 'medium'
            ? 'Order has medium priority'
            : 'Order has normal priority';

    return {
      orderId: order.id,
      status: order.status,
      quantity: order.quantity,
      priority,
      message,
    };
  }
}
