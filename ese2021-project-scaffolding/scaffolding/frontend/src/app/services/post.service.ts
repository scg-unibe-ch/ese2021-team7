import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/



  private post: Post | undefined;


  /*******************************************************************************************************************
   * OBSERVABLE SOURCES & STREAMS
   ******************************************************************************************************************/

    // Observable Sources
    private postSource = new Subject<Post>();

  // Observable Streams
  post$ = this.postSource.asObservable();


  /*******************************************************************************************************************
   * GETTERS
   ******************************************************************************************************************/

  getPost(): Post | undefined {
    return this.post;
  }


  /*******************************************************************************************************************
   * SETTERS
   ******************************************************************************************************************/


  setPost(post: Post | undefined): void {
    this.postSource.next(post);
  }


  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor() {
    // Observer
    this.post$.subscribe(res => this.post = res);

    // Default values
  }
}
