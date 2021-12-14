import { TestBed } from '@angular/core/testing';

import { ShopDataSourceService } from './shop-data-source.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('ShopDataSourceService', () => {
  let service: ShopDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
    });
    service = TestBed.inject(ShopDataSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
