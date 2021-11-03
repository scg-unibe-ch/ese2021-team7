import { Component, OnInit } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Post} from "../models/post.model";
import {Feed} from "../models/feed.model";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  currentFeed: Feed = new Feed(0,'', []);

  loggedIn: boolean | undefined;
  isAdmin: boolean | undefined;
  currentUser: User | undefined;

  constructor(
    public httpClient: HttpClient,
    private route: Router,
    public userService: UserService
  ) {
    this.readPosts();
  }

  ngOnInit(): void {
    // Listen for changes
    this.userService.loggedIn$.subscribe(res => {
      this.loggedIn = res;
    });
    this.userService.isAdmin$.subscribe( res => {
      this.isAdmin = res;
    });
    this.userService.user$.subscribe( res => {
      this.currentUser = res;
    })

    //current Value
    this.loggedIn = this.userService.getLoggedIn();
    this.isAdmin = this.userService.getIsAdmin();
    this.currentUser = this.userService.getUser();
  }

  // READ all created posts
  readPosts(): void {
    this.httpClient.get(environment.endpointURL + "post/all").subscribe((res: any) => {
      console.log(res);
      this.currentFeed = new Feed(0,'', []);
      res.forEach((post: any) => {
        post.score = post.upvote - post.downvote;
        this.httpClient.get(environment.endpointURL + "user/getById" , {
          params: {
            userId: post.UserUserId
          }
        }).subscribe((res: any) => {
          post.CreationUserName = res.userName;
          this.currentFeed.posts.push(
              new Post(post.postId, 0,post.title,post.text,post.image,post.upvote,post.downvote,post.score,post.category, post.createdAt,post.UserUserId,post.CreationUserName))
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
    this.httpClient.put(environment.endpointURL + "post/all" , {
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
    this.httpClient.post(environment.endpointURL + "post/delete", {
      postId: post.postId
    }).subscribe(() => {
      this.currentFeed.posts.splice(this.currentFeed.posts.indexOf(post), 1);
    });
  }

  updatePost(post: Post): void {
    this.route.navigate(['/updatepost'], {queryParams: {postId: (post.postId)}}).then(r =>{});
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
}
