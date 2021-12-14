import { TestBed } from '@angular/core/testing';
import { CategoryFormService } from './category-form.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('CategoryFormService', () => {
  let service: CategoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
    });
    service = TestBed.inject(CategoryFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
