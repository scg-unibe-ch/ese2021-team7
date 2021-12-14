import { TestBed } from '@angular/core/testing';

import { OrderListServiceService } from './order-list-service.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('OrderListServiceService', () => {
  let service: OrderListServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(OrderListServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
