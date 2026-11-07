import { OrderEntity } from './entities/order.entity';
import { describe, it, expect } from '@jest/globals';
import { OrderPriorityService } from './order-priority.service';

describe('OrderPriorityService', () => {
  const service = new OrderPriorityService();

  it('allows quantity 1 to return normal', () => {
    const mockOrder = {
      id: 1,
      quantity: 1,
      status: 'pending',
    } as OrderEntity;

    expect(service.classify(mockOrder)).toEqual({
      orderId: 1,
      status: 'pending',
      quantity: 1,
      priority: 'normal',
      message: 'Order has normal priority',
    });
  });

  it('allows quantity 3 to return medium', () => {
    const mockOrder = {
      id: 2,
      quantity: 3,
      status: 'pending',
    } as OrderEntity;

    expect(service.classify(mockOrder)).toEqual({
      orderId: 2,
      status: 'pending',
      quantity: 3,
      priority: 'medium',
      message: 'Order has medium priority',
    });
  });

  it('allows quantity 4 to return high', () => {
    const mockOrder = {
      id: 3,
      quantity: 4,
      status: 'pending',
    } as OrderEntity;

    expect(service.classify(mockOrder)).toEqual({
      orderId: 3,
      status: 'pending',
      quantity: 4,
      priority: 'high',
      message: 'Prepare this order soon',
    });
  });

  it('allows quantity 5 and ready to return completed', () => {
    const mockOrder = {
      id: 4,
      quantity: 5,
      status: 'ready',
    } as OrderEntity;

    expect(service.classify(mockOrder)).toEqual({
      orderId: 4,
      status: 'ready',
      quantity: 5,
      priority: 'completed',
      message: 'Order is ready',
    });
  });
});
