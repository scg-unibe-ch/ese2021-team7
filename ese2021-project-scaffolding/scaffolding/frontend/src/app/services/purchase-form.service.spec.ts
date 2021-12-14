import { TestBed } from '@angular/core/testing';

import { PurchaseFormService } from './purchase-form.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('PurchaseFormService', () => {
  let service: PurchaseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
    });
    service = TestBed.inject(PurchaseFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
