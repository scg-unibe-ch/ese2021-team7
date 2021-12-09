import {Component, DoCheck, Injector, OnInit} from '@angular/core';
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
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { PostService } from '../services/post.service';
import { AccessPermission } from '../models/access-permission';
import { BaseComponent } from '../base/base.component';
import { PermissionType } from '../models/permission-type';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent extends BaseComponent implements OnInit, DoCheck {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  postList: Post[] = [];

  sortBy: string = '0';

  filterBy: number = 0;

  //array with post categories
  postCategories: Category[] = [];

  // overrides
  permissionToAccess = PermissionType.AccessHome;
  routeIfNoAccess: string = "/home";

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    public httpClient: HttpClient,
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private postService: PostService,
    public injector: Injector
  ) {
    super(injector);
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit(): void {
    //set up categories
    //listener for product categories
    this.categoryService.postCategories$.subscribe(res => this.postCategories = res);
    //current value of product categories
    this.postCategories = this.categoryService.getPostCategories();


    super.initializeUser(); //parents method
    super.evaluateAccessPermissions();

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
          let category = this.categoryService.getCategoryById(post.category);
          if(this.checkIfPostIsAcceptedByFilter(category)){
            this.httpClient.get(environment.endpointURL + "user/getById", {
              params: {
                userId: post.UserUserId
              }
            }).subscribe(
              (user: any) => this.postList.push(this.postService.createPostFromBackendResponse(post, category, user)),
              (error: any) => console.log(error)
            );
          }
          });
        });
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
          let category = this.categoryService.getCategoryById(post.category);
          if(this.checkIfPostIsAcceptedByFilter(category)){
            this.httpClient.get(environment.endpointURL + "user/getById", {
              params: {
                userId: post.UserUserId
              }
            }).subscribe(
              (user: any) => this.postList.push(this.postService.createPostFromBackendResponse(post, category, user, VotingState.NotAllowed)),
              (error: any) => console.log(error)
            );
          }
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
    this.router.navigate(['/post-form'], {queryParams: {update: 'true', postId: (post.postId)}}).then(r => {
    });
  }

  reloadFeed() {
    this.filterBy = 0;
    //this.getPostCategories();
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

  checkIfPostIsAcceptedByFilter(category: Category):boolean {
    if (this.filterBy == 0){
      return true;
    }
    else{
      if (this.filterBy == category.id){
        return true;
      }
      else return false;
    }
  }



}
