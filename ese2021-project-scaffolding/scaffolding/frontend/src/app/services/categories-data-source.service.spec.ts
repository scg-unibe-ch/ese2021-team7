import { TestBed } from '@angular/core/testing';

import { CategoriesDataSourceService } from './categories-data-source.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('CategoriesDataSourceService', () => {
  let service: CategoriesDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
    });
    service = TestBed.inject(CategoriesDataSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
