import { TestBed } from '@angular/core/testing';

import { OrdersDataSourceService } from './orders-data-source.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('OrdersDataSourceService', () => {
  let service: OrdersDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
    });
    service = TestBed.inject(OrdersDataSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
