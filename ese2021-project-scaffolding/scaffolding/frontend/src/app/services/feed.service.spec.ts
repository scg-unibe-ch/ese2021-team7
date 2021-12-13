import { TestBed } from '@angular/core/testing';

import { FeedService } from './feed.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('FeedService', () => {
  let service: FeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
