import { TestBed } from '@angular/core/testing';

import { ShopDataSourceService } from './shop-data-source.service';

describe('ShopDataSourceService', () => {
  let service: ShopDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopDataSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
