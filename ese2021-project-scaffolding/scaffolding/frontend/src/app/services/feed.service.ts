import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {BehaviorSubject, forkJoin } from 'rxjs';
import {map, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { VotingState } from '../models/voting-state';
import { CategoryService } from './category.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/
    // Post array
  private posts: any[] = [];
  private sorting: number = 0;
  private filter: number = 0;

  /*******************************************************************************************************************
   * OBSERVABLE SOURCES & STREAMS
   ******************************************************************************************************************/

  // Observable Sources
  private postSource = new BehaviorSubject<Post[]>([]);
  private postsLoading = new BehaviorSubject<boolean>(false);

  // Stream
  posts$ = this.postSource.asObservable();
  postsLoading$ = this.postsLoading.asObservable();

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    public httpClient: HttpClient,
    public categoryService: CategoryService,
    private userService: UserService
  ) {}

  /*******************************************************************************************************************
   * GETTERS
   ******************************************************************************************************************/

  getPosts(): Post[] {
    return this.posts;
  }

  /*******************************************************************************************************************
   * SETTERS
   ******************************************************************************************************************/

  setFilter(filter: number): void {
      this.filter = filter;
  }

  setSorting(sorting: number): void {
      this.sorting = sorting;
  }

  /*******************************************************************************************************************
   * BACKEND HANDLERS
   ******************************************************************************************************************/

  private getAllPostsFromBackend(loggedIn: boolean, requestUser: User | undefined): void {
    this.postsLoading.next(true);
    this.getHttpRequest(this.sorting,requestUser)
      .pipe(
        mergeMap((posts:any[]) => { //mergeMap to handle inner observables
            let forkJoinArray: any[] = [];
            posts.forEach( //replace each object in array through second call/observable
              (post: any) => forkJoinArray.push(this.userService.getUserByIdAsObservable(post.UserUserId)
                .pipe(
                map(
                  (user: any) => {
                    if(requestUser == undefined || requestUser.isAdmin || !loggedIn){
                      return this.createPostFromBackendResponse(post, this.categoryService.getCategoryById(post.category), user, requestUser, VotingState.NotAllowed);  // join together and give back one OrderToDisplay
                    } else {
                      return this.createPostFromBackendResponse(post,  this.categoryService.getCategoryById(post.category), user, requestUser);  // join together and give back one OrderToDisplay
                    }
                    }
                )
              )))
            return forkJoin(forkJoinArray); //forkjoin: give back array of observables
          }
        ),
        //filter if set
        map((posts: any) =>
          posts.filter((post: Post) => {
            if(this.filter==0 || this.filter == undefined) {
               return true;
            } else {
              return post.category.id == this.filter;
            }
          }) //checks if category id matches
        )
      ).subscribe(res => {
        this.postSource.next(res);
        this.posts = res;
        this.postsLoading.next(false);
    });
  }


  private getHttpRequest(sorting: number, user?: User | undefined): Observable<any> {
    if(sorting != 0) {
      if(user && user != undefined){
        return this.httpClient.get(environment.endpointURL + "post/all", {params: {
            sortBy: sorting,
            userId: user.userId
          }});
      } else {
        return this.httpClient.get(environment.endpointURL + "post/all", {
          params: {
            sortBy: sorting
          }
        });
      }
    } else {
      if(user && user != undefined) {
        return this.httpClient.get(environment.endpointURL + "post/all", {
          params: {
            userId: user.userId
          }
        });
      }
        else {
        return this.httpClient.get(environment.endpointURL + "post/all");
        }
      }
  }

  refreshPosts(loggedIn: boolean, requestUser: User | undefined): void {
    this.getAllPostsFromBackend(loggedIn, requestUser);
  }

  deletePost(postId: number): Observable<any> {
    return this.httpClient.post(environment.endpointURL + "post/delete", {
      postId: postId
    });
  }

  upvotePost(postId: number): Observable<any> {
    return this.httpClient.post(environment.endpointURL + "post/upvote", {
      postId: postId
    });
  }

  downvotePost(postId: number): Observable <any> {
    return this.httpClient.post(environment.endpointURL + "post/downvote", {
      postId: postId
    });
  }


  /*******************************************************************************************************************
   * HELPER METHODS
   ******************************************************************************************************************/

  /**
   * Takes backend responses and returns a Post object.
   * @param post backend response
   * @param category parsed Category object
   * @param user backend response
   * @private
   */
  createPostFromBackendResponse(post: any, category: Category, user: any, requestUser?: User, votingState?: VotingState): Post {
    return new Post(
      post.postId,
      post.title,
      post.text,
      post.image,
      post.score,
      category,
      post.UserUserId,
      post.UserUserId==requestUser?.userId? "Your post" : user.userName,
      votingState? votingState: this.evaluateVotingState(post.votingStatus));
  }


  evaluateVotingState(votingStatus: string): VotingState {
    switch (votingStatus){
      case 'not voted': {
        return VotingState.NotVoted;
      }
      case 'upvoted': {
        return VotingState.Upvoted;
      }
      case 'downvoted': {
        return VotingState.Downvoted;
      }
      default: {
        return VotingState.NotAllowed;
      }
    }
  }


}
