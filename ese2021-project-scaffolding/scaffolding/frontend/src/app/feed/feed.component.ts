import {Component, DoCheck, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Post} from "../models/post.model";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";
import {Product} from "../models/product.model";
import {ConfirmationDialogModel} from "../ui/confirmation-dialog/confirmation-dialog";
import {ConfirmationDialogComponent} from "../ui/confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {OrderState} from "../order-list/order/order-state";
import {Vote} from "../models/vote.model";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, DoCheck {

  postList: Post[] = [];

  votesByCurrentUser: Vote[] = [];

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
    this.readFeed();
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
  }

  ngDoCheck(): void {
    //current Value

    //console.log("ngDoCheck is working.")
    this.loggedIn = this.userService.getLoggedIn();
    this.currentUser = this.userService.getUser();
  }

  // ORDER - Feed
  /*
  0 = sorted by creation date
  1 = sorted by score
  default = sorted by creation date
   */
  readFeed(): void {
    //TODO create own method for user who is not logged in
    this.httpClient.get(environment.endpointURL + "post/all", {
      params: {
        sortBy: this.sortBy
      }
    }).subscribe(
      (res: any) => {
        this.postList = [];
        this.votesByCurrentUser = [];
        res.forEach((post: any) => {
          post.Votes.forEach((vote: any) => {
            if (this.currentUser?.userId == vote.UserUserId){
              this.votesByCurrentUser.push(new Vote(post.postId, vote.upvote))
            }
          })
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
                  //const i = this.getRightCategory(post.category);
                  this.postList.push(
                    new Post(post.postId, post.title, post.text, post.image, post.score, category.name, post.UserUserId, res.userName));
                  console.log(this.votesByCurrentUser);
                },
                (error: any) => {
                  console.log(error);
                });
            }
          });
        });
      });
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
    this.readFeed();
  }

  upvotePost(post: Post) {
    this.httpClient.post(environment.endpointURL + "post/upvote", {
      postId: post.postId
    }).subscribe((res: any) => {
      console.log(res);
      post.score = res.upvote - res.downvote;
    });
  }

  downvotePost(post: Post) {
    this.httpClient.post(environment.endpointURL + "post/downvote", {
      postId: post.postId
    }).subscribe((res: any) => {
      console.log(res);
      post.score = res.upvote - res.downvote;
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
    this.readFeed();
  }

  filterFeed(event:any) {
    this.readFeed();
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
