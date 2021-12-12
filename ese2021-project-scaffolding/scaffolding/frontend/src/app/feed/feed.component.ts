import {Component, DoCheck, Injector, OnInit, ViewChild} from '@angular/core';
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
import { FeedService } from '../services/feed.service';
import { MatSelect } from '@angular/material/select';
import { PostFormComponent } from '../post-form/post-form.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent extends BaseComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  @ViewChild('sortSelect') selectFilter!: MatSelect;

  postList: Post[] = [];

  sortBy: string = '0';

  filterBy: number = 0;

  isLoadingPosts: boolean = false;

  canCreatePosts: boolean = false;

  //array with post categories
  //postCategories: Category[] = [];

  // overrides BaseComponent
  permissionToAccess = PermissionType.AccessHome;
  routeIfNoAccess: string = "/home";

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    public httpClient: HttpClient,
    private dialog: MatDialog,
    private postService: PostService,
    public injector: Injector,
    private feedService: FeedService
  ) {
    super(injector);
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit(): void {
    //super.initializeUser(); //parents method
    //super.evaluateAccessPermissions();
    //super.initializeCategories();
    //console.log(this.postCategories);

    super.ngOnInit();
    //loads Data
    //this.feedService.setUserAndLoggedIn(this.loggedIn, this.currentUser);
    this.feedService.refreshPosts(this.loggedIn, this.currentUser);
    //listener
    this.feedService.posts$.subscribe(res => this.postList = res);
    //current value
    this.postList = this.feedService.getPosts();
    //loading flag
    this.feedService.postsLoading$.subscribe(res => this.isLoadingPosts = res);

    // set Permissions to create post
    if (this.currentUser == undefined) {
      this.canCreatePosts = false;
    } else if (this.currentUser.featuresPermissions) {
      this.canCreatePosts = this.currentUser.featuresPermissions?.checkPermissions(PermissionType.CreatePost);
      }
  }


  /*******************************************************************************************************************
   * USER ACTIONS
   ******************************************************************************************************************/


  sortFeed(event: any):void  {
    this.feedService.setSorting(event.value);
    this.feedService.refreshPosts(this.loggedIn, this.currentUser);
  }

  filterFeed(event:any):void {
    this.feedService.setFilter(event.value);
    this.feedService.refreshPosts(this.loggedIn, this.currentUser);
  }

  /**
   * Opens Dialog box with product update form in it.
   *
   */
  updatePost(post: Post): void {
    const dialogRef = this.dialog.open(PostFormComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
      data: {
        isUpdate: true,
        isCreate: false,
        postId: post.postId,
        userId: post.CreationUser
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.feedService.refreshPosts(this.loggedIn, this.currentUser);
    });
  }

  /**
   * Opens Dialog box with with product create form in it.
   *
   */
  createPost(): void {
    const dialogRef = this.dialog.open(PostFormComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
      data: {
        isUpdate: false,
        isCreate: true,
        productId: "",
        userId: ""
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.feedService.refreshPosts(this.loggedIn, this.currentUser);
    });
  }


  reloadFeed() {
   this.feedService.refreshPosts(this.loggedIn, this.currentUser);
  }

  confirmDelete(post: Post): void {
  const dialogData = new ConfirmationDialogModel('Confirm', 'Are you sure you want to delete this post?','Cancel','Delete post');
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    maxWidth: '400px',
    closeOnNavigation: true,
    data: dialogData
  })
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult) {
        this.feedService.deletePost(post.postId)
          .subscribe(res =>  this.feedService.refreshPosts(this.loggedIn, this.currentUser));
      }
    });
  }


  upvotePost(post: Post) {
    this.feedService.upvotePost(post.postId).subscribe((res: any) => {
      post.score = res.score;
    });
  }

  downvotePost(post: Post) {
    return this.feedService.downvotePost(post.postId)
      .subscribe((res: any) => {
      post.score = res.score;
    });
  }


}
