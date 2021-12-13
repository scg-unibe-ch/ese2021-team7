import { TestBed } from '@angular/core/testing';

import { SelectHouseFormService } from './select-house-form.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('SelectHouseFormService', () => {
  let service: SelectHouseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
    });
    service = TestBed.inject(SelectHouseFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
