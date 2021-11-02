import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Post} from "../models/post.model";
import {Feed} from "../models/feed.model";
import {User} from "../models/user.model";
import {MatGridListModule} from '@angular/material/grid-list';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  postList: Post[] = [];

  currentFeed: Feed = new Feed(0,'', []);

  currentUser: User | undefined;

  loggedIn: Boolean | undefined;

  isAdmin: boolean | undefined;

  constructor(
    public userService: UserService,
    public httpClient: HttpClient
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    userService.user$.subscribe(res => this.currentUser = res);
    userService.isAdmin$.subscribe( res => this.isAdmin = res);

    //current Value
    this.loggedIn = userService.getLoggedIn();
    this.currentUser = userService.getUser();
    this.isAdmin = userService.getIsAdmin();
    this.readPosts();
  }

  ngOnInit(): void {
  }

  checkUpdateAndDeletePermission(creatorId: number): boolean{
    console.log(creatorId);
    console.log(this.currentUser?.userId);
    if (this.isAdmin) return true;
    else if (this.currentUser?.userId == creatorId) return true;
    return false;
}

  // READ all created posts
  readPosts(): void {
    this.httpClient.get(environment.endpointURL + "post/all").subscribe((res: any) => {
      console.log(res);
      this.currentFeed = new Feed(0,'', []);
      res.forEach((post: any) => {
        this.currentFeed.posts.push(
          new Post(post.postId, 0,post.title,post.text,post.image,post.upvote,post.downvote,0,post.category, post.createdAt,post.UserUserId))
        },
        (error: any) => {
          console.log(error);
        });
    });
  }

  // ORDER - Feed
  /*
  1 =
  2 =
   */
  sortList(sortBy: Number): void {
    this.httpClient.put(environment.endpointURL + "post/all" , {
      sortBy: sortBy
    }).subscribe(
      (res: any) => {
        this.currentFeed = new Feed(0,'', []);
        res.forEach((post: any) => {
            this.currentFeed.posts.push(
              new Post(post.postId, 0,post.title,post.text,post.image,post.upvote,post.downvote,0,post.category,'',0))
          },
          (error: any) => {
            console.log(error);
          });
      }
    );
  }


  deletePost(post: Post): void {
    if (this.checkUpdateAndDeletePermission(post.CreationUser)){
      this.httpClient.post(environment.endpointURL + "post/delete", {
        postId: post.postId
      }).subscribe(() => {
        this.currentFeed.posts.splice(this.currentFeed.posts.indexOf(post), 1);
      });
    }
    else console.log("Permission denied");
  }

  updatePost(post: Post): void {
    if (this.checkUpdateAndDeletePermission(post.CreationUser)){
      // TODO routing to updatepost
    }
    else console.log("Permission denied");
  }

  buttonClicked() {
    this.readPosts();
  }

  downvotePost(post: Post) {
    console.log("Downvote button works")
    this.httpClient.post(environment.endpointURL + "post/downvote", {
      postId: post.postId
    }).subscribe((res: any) => {
      console.log(res);
      //this.Score = res.post.upvote - res.post.downvote;
      //this.postService.setPost(new Post(res.post.postId,this.postToDownvote.feedId,this.postToDownvote.title,
      //this.postToDownvote.text,this.postToDownvote.image,this.postToDownvote.upvote,res.post.downvote,this.Score,
      //this.postToDownvote.category,this.postToDownvote.CreationDate,this.postToDownvote.CreationUser));
    });
  }

  upvotePost(post: Post) {
    console.log("Upvote button works")
    this.httpClient.post(environment.endpointURL + "post/upvote", {
      postId: post.postId
    }).subscribe((res: any) => {
      console.log(res);
      //this.Score = res.post.upvote - res.post.downvote;
      //this.postService.setPost(new Post(res.post.postId,this.postToUpvote.feedId,this.postToUpvote.title,
      //this.postToUpvote.text,this.postToUpvote.image,res.post.upvote,this.postToUpvote.downvote,this.Score,
      //this.postToUpvote.category,this.postToUpvote.CreationDate,this.postToUpvote.CreationUser));
    });
  }





}
