import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Post} from "../models/post.model";
import {ConfirmationDialogModel} from "../ui/confirmation-dialog/confirmation-dialog";
import {ConfirmationDialogComponent} from "../ui/confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import { PostService } from '../services/post.service';
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
    super.initializeCurrentValues().subscribe(
      res => {
        this.loggedIn = res[1];
        this.currentUser = res[2];
        this.postCategories = res[3];
        this.productCategories = res[4];

        //loads Data
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
      });
    super.setUpListeners();
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

  /**
   * Refreshes the posts in the feed
   */
  reloadFeed() {
   this.feedService.refreshPosts(this.loggedIn, this.currentUser);
  }

  /**
   * Asks the user or admin to confirm the deletion of the post
   *
   * @param post: Post that the user or admin wants to delete
   */
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

  /**
   * Upvote the Post: the score is increased by 1
   *
   * @param post: the post to be upvoted
   */
  upvotePost(post: Post) {
    this.feedService.upvotePost(post.postId).subscribe((res: any) => {
      post.score = res.score;
    });
  }

  /**
   * Downvote the Post: the score is decreased by 1
   *
   * @param post: the post to be downvoted
   */
  downvotePost(post: Post) {
    return this.feedService.downvotePost(post.postId)
      .subscribe((res: any) => {
      post.score = res.score;
    });
  }
}
