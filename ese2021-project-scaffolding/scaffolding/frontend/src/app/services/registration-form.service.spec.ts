import { TestBed } from '@angular/core/testing';

import { RegistrationFormService } from './registration-form.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('RegistrationFormService', () => {
  let service: RegistrationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
    });
    service = TestBed.inject(RegistrationFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
