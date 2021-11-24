import {Component, DoCheck, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Post} from "../models/post.model";
import {Feed} from "../models/feed.model";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";
import {Product} from "../models/product.model";
import {ConfirmationDialogModel} from "../ui/confirmation-dialog/confirmation-dialog";
import {ConfirmationDialogComponent} from "../ui/confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, DoCheck {

  currentFeed: Feed = new Feed(0, '', []);

  loggedIn: boolean | undefined;
  currentUser: User | undefined;

  constructor(
    public httpClient: HttpClient,
    private route: Router,
    public userService: UserService,
    private dialog: MatDialog
  ) {
    this.readPosts();
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
  }

  ngDoCheck(): void {
    //current Value
    console.log("ngDoCheck is working.")
    this.loggedIn = this.userService.getLoggedIn();
    this.currentUser = this.userService.getUser();
  }

  // READ all created posts
  readPosts(): void {
    this.httpClient.get(environment.endpointURL + "post/all").subscribe((res: any) => {
      console.log(res);
      this.currentFeed = new Feed(0, '', []);
      res.forEach((post: any) => {
        post.score = post.upvote - post.downvote;
        this.httpClient.get(environment.endpointURL + "user/getById", {
          params: {
            userId: post.UserUserId
          }
        }).subscribe((res: any) => {
            post.CreationUserName = res.userName;
            this.currentFeed.posts.push(
              new Post(post.postId, 0, post.title, post.text, post.image, post.upvote, post.downvote, post.score, post.category, post.createdAt, post.UserUserId, post.CreationUserName))
          },
          (error: any) => {
            console.log(error);
          });
      });
    });
  }

  // ORDER - Feed
  /*
  1 = sorted by score
  default = sorted by creation date
   */
  sortList(sortBy: Number): void {
    this.httpClient.put(environment.endpointURL + "post/all", {
      sortBy: sortBy
    }).subscribe(
      (res: any) => {
        this.currentFeed = new Feed(0, '', []);
        res.forEach((post: any) => {
          post.score = post.upvote - post.downvote;
          this.httpClient.get(environment.endpointURL + "user/getById", {
            params: {
              userId: post.UserUserId
            }
          }).subscribe((res: any) => {
              post.CreationUserName = res.userName;
              this.currentFeed.posts.push(
                new Post(post.postId, 0, post.title, post.text, post.image, post.upvote, post.downvote, post.score, post.category, post.createdAt, post.UserUserId, post.creationUserUsername))
            },
            (error: any) => {
              console.log(error);
            });
        });
      });
  }

  deletePost(post: Post): void {
    this.handleDelete(post);
  }
    /*this.httpClient.post(environment.endpointURL + "post/delete", {
      postId: post.postId
    }).subscribe(() => {
      this.currentFeed.posts.splice(this.currentFeed.posts.indexOf(post), 1);
    });
    }
     */





  updatePost(post: Post): void {
    this.route.navigate(['/post-form'], {queryParams: {update: 'true', postId: (post.postId)}}).then(r => {
    });
  }

  buttonClicked() {
    this.readPosts();
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
  const dialogData = new ConfirmationDialogModel('Confirm', 'Are you sure you want to delete this post?');
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
        this.currentFeed.posts.splice(this.currentFeed.posts.indexOf(post), 1);
      });
    }
  });
}
}
