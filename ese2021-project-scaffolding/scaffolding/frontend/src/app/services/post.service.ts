import { Injectable } from '@angular/core';
import {Post} from "../models/post.model";
import { Subject } from 'rxjs';
import { Category } from '../models/category';
import { VotingState } from '../models/voting-state';

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




  /**
   * Takes backend responses and returns a Post object.
   * @param post backend response
   * @param category parsed Category object
   * @param user backend response
   * @private
   */
  createPostFromBackendResponse(post: any, category: Category, user: any, votingState?: VotingState): Post {
    return new Post(
      post.postId,
      post.title,
      post.text,
      post.image,
      post.score,
      category,
      post.UserUserId,
      user.userName,
      votingState? votingState: this.evaluateVotingState(post.votingStatus));
  }


  evaluateVotingState(votingStatus: string): VotingState {
    console.log('given votestate: ' + votingStatus);
    switch (votingStatus){
      case 'not voted': {
        console.log('found votestate: Not voted')
        return VotingState.NotVoted;
      }
      case 'upvoted': {
        console.log('found votestate: upvoted')
        return VotingState.Upvoted;
      }
      case 'downvoted': {
        console.log('found votestate: downvoted')
        return VotingState.Downvoted;
      }
      default: {
        console.log('found votestate: not allowed')
        return VotingState.NotAllowed;
      }
    }
  }



}
