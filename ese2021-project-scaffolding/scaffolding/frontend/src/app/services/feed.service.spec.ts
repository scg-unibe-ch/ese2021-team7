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

  /**
   * Check if arrays are empty in the beginning
   */
  it('posts arrays should be empty in the beginning', () =>{
    expect(service.getPosts().length).toEqual(0);
  })


  //createPostFromBackendResponse

  //evaluateVotingState

  //getAllPostsFromBackend

  //getHttpRequest

});
