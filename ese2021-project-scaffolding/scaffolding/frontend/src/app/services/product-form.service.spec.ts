import { TestBed } from '@angular/core/testing';

import { ProductFormService } from './product-form.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('ProductFormService', () => {
  let service: ProductFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
    });
    service = TestBed.inject(ProductFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
