import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PostFormService } from './post-form.service';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('PostFormService', () => {
  let service: PostFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
    });
    service = TestBed.inject(PostFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
