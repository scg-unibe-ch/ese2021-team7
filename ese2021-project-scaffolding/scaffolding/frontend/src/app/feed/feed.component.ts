import {Component, DoCheck, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Post} from "../models/post.model";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";
import {ConfirmationDialogModel} from "../ui/confirmation-dialog/confirmation-dialog";
import {ConfirmationDialogComponent} from "../ui/confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {VotingState} from "../models/voting-state";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, DoCheck {

  postList: Post[] = [];

  loggedIn: boolean | undefined;
  currentUser: User | undefined;

  sortBy: string = '0';

  filterBy: string = '';

  postCategories: string[] = [];

  constructor(
    public httpClient: HttpClient,
    private route: Router,
    public userService: UserService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    // Listen for changes
    this.userService.loggedIn$.subscribe(res => {
      this.loggedIn = res;
    });
    this.userService.user$.subscribe(res => {
      this.currentUser = res;
    })
    //current Value
    this.loggedIn = this.userService.getLoggedIn();
    this.currentUser = this.userService.getUser();
    this.getPostCategories();
    this.evaluateAccessForCurrentUser();
  }

  ngDoCheck(): void {
    //current Value
    this.loggedIn = this.userService.getLoggedIn();
    this.currentUser = this.userService.getUser();
  }

  // ORDER - Feed
  /*
  0 = sorted by creation date
  1 = sorted by score
  default = sorted by creation date
   */
  getFeedForUser(): void {
    let userId = this.currentUser?.userId || 0;
    console.log(userId);
    this.httpClient.get(environment.endpointURL + "post/all", {
      params: {
        sortBy: this.sortBy,
        userId: userId
      }
    }).subscribe(
      (res: any) => {
        console.log(res);
        this.postList = [];
        res.forEach((post: any) => {
          this.httpClient.get(environment.endpointURL + "category/byId",{
            params: {
              categoryId: post.category
            }
          }).subscribe((category: any) => {
            if (this.checkIfPostIsAcceptedByFilter(category.name)){
              this.httpClient.get(environment.endpointURL + "user/getById", {
                params: {
                  userId: post.UserUserId
                }
              }).subscribe((res: any) => {
                  this.postList.push(
                    new Post(post.postId, post.title, post.text, post.image, post.score, category.name, post.UserUserId, res.userName, this.evaluateVotingState(post.votingStatus)));
                  },
                (error: any) => {
                  console.log(error);
                });
            }
          });
        });
      });
  }

  evaluateVotingState(votingStatus: string): VotingState {
    console.log('given votstat: ' + votingStatus);
    switch (votingStatus){
      case 'not voted': {
        console.log('found votestate: Not VOted')
        return VotingState.NotVoted;
      }
      case 'upvoted': {
        console.log('found votestate: upvoted')
        return VotingState.Upvoted;
      }
      case 'downvoted': {
        console.log('found votestate: downvOted')
        return VotingState.Downvoted;
      }
      default: {
        console.log('found votestate: not allowed')
        return VotingState.NotAllowed;
      }
    }
  }

  getFeedForAdminsAndGuests(): void {
    this.httpClient.get(environment.endpointURL + "post/all", {
      params: {
        sortBy: this.sortBy
      }
    }).subscribe(
      (res: any) => {
        this.postList = [];
        res.forEach((post: any) => {
          this.httpClient.get(environment.endpointURL + "category/byId",{
            params: {
              categoryId: post.category
            }
          }).subscribe((category: any) => {
            if (this.checkIfPostIsAcceptedByFilter(category.name)){
              this.httpClient.get(environment.endpointURL + "user/getById", {
                params: {
                  userId: post.UserUserId
                }
              }).subscribe((res: any) => {
                  this.postList.push(
                    new Post(post.postId, post.title, post.text, post.image, post.score, category.name, post.UserUserId, res.userName, VotingState.NotAllowed));
                },
                (error: any) => {
                  console.log(error);
                });
            }
          });
        });
      });
  }

  evaluateAccessForCurrentUser(): void {
    if (this.loggedIn){
      if (!this.currentUser?.isAdmin){
        this.getFeedForUser();
      }
      else {
        this.getFeedForAdminsAndGuests();
      }
    }
    else {
      this.getFeedForAdminsAndGuests();
    }
  }

  deletePost(post: Post): void {
    this.handleDelete(post);
  }

  updatePost(post: Post): void {
    this.route.navigate(['/post-form'], {queryParams: {update: 'true', postId: (post.postId)}}).then(r => {
    });
  }

  reloadFeed() {
    this.filterBy = '';
    this.getPostCategories();
    this.evaluateAccessForCurrentUser();
  }

  upvotePost(post: Post) {
    this.httpClient.post(environment.endpointURL + "post/upvote", {
      postId: post.postId
    }).subscribe((res: any) => {
      console.log(res);
      post.score = res.score;
    });
  }

  downvotePost(post: Post) {
    this.httpClient.post(environment.endpointURL + "post/downvote", {
      postId: post.postId
    }).subscribe((res: any) => {
      console.log(res);
      post.score = res.score;
    });
  }

  handleDelete(post: Post): void {
  const dialogData = new ConfirmationDialogModel('Confirm', 'Are you sure you want to delete this post?','Cancel','Delete post');
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    maxWidth: '400px',
    closeOnNavigation: true,
    data: dialogData
  })
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult) {
      this.httpClient.post(environment.endpointURL + "post/delete", {
        postId: post.postId
      }).subscribe(() => {
        this.postList.splice(this.postList.indexOf(post), 1);
      });
    }});
  }

  sortFeed(event: any) {
    this.evaluateAccessForCurrentUser();
  }

  filterFeed(event:any) {
    this.evaluateAccessForCurrentUser();
  }

  checkIfPostIsAcceptedByFilter(category: string):boolean {
    if (this.filterBy == ''){
      return true;
    }
    else{
      if (this.filterBy == category){
        return true;
      }
      else return false;
    }
  }

  getPostCategories(): void {
    this.postCategories = [];
    this.httpClient.get(environment.endpointURL + "category/all").subscribe((res:any) => {
      res.forEach((category: any) => {
        if (category.type == 0){
          this.postCategories.push(category.name)
        }
      });
    });
  }


}
