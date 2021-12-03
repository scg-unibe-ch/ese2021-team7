import { TestBed } from '@angular/core/testing';

import { CategoriesDataSourceService } from './categories-data-source.service';

describe('CategoriesDataSourceService', () => {
  let service: CategoriesDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesDataSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
