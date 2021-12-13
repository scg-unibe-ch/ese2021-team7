import { TestBed } from '@angular/core/testing';

import { CategoryService } from './category.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CategoryService);
  });

  /**
   * Check if Service is created correctly
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Check if arrays are empty in the beginning
   */
  it('arrays should be empty', () =>{
    expect(service.getProductCategories().length).toBeGreaterThanOrEqual(0);
    expect(service.getProductCategories().length).toBeLessThanOrEqual(0);

  })

});
