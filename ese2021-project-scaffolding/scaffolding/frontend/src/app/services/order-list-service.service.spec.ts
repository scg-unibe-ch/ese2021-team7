import { TestBed } from '@angular/core/testing';

import { OrderListServiceService } from './order-list-service.service';

describe('OrderListServiceService', () => {
  let service: OrderListServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderListServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
