import { Injectable } from '@angular/core';
import {Post} from "../models/post.model";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  // Variables
  private post: Post | undefined;

  // Observable sources
  private postSource = new Subject<Post>();

  // Observable streams
  post$ = this.postSource.asObservable();

  // Getters
  getPost(): Post | undefined{
    return this.post;
  }

  // Setters
  setPost(post: Post | undefined): void{
    this.postSource.next(post);
  }

  // Constructor
  constructor() {
    // Observer
    this.post$.subscribe(res => this.post = res);
  }
}
