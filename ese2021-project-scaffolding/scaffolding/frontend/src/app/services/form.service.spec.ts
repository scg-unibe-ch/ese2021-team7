import { TestBed } from '@angular/core/testing';

import { FormService } from './form.service';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('FormService', () => {
  let service: FormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        [{ provide: FormService, useClass: FormServiceMock }]
      ],
    });
    service = TestBed.inject(FormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


});


class FormServiceMock {
  buildForm(preSets?: any): FormGroup {
    return new FormGroup({});
  };
}
