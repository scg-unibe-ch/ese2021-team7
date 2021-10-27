import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Post} from "../models/post.model";
import {Feed} from "../models/feed.model";
import {User} from "../models/user.model";


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

  constructor(
    public userService: UserService,
    public httpClient: HttpClient
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    userService.user$.subscribe(res => this.currentUser = res);

    //current Value
    this.loggedIn = userService.getLoggedIn();
    this.currentUser = userService.getUser();
    // TODO this.readPosts();
    this.currentFeed.posts = this.createPostList();
  }

  ngOnInit(): void {
  }

  createPostList(): Post [] {
    let list: Post[] = [];
    for(let i = 0; i++, i<5;){
      list.push(new Post(i,0,'Post Title','Some text',
        'https://betanews.com/wp-content/uploads/2016/10/game-of-thrones-logo.jpg',
        0,0,0,'','',0)
    );
    }
    return list;
  }

  buttonClicked(): void {
    this.readPosts();
  }

  // READ all created posts
  readPosts(): void {
    this.httpClient.get(environment.endpointURL + "post/all").subscribe((res: any) => {
      this.currentFeed = new Feed(0,'', []);
      res.forEach((post: any) => {
        this.currentFeed.posts.push(
          new Post(post.postId, 0,post.title,post.text,post.image,post.upvote,post.downvote,0,post.category,'',0))
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
            //TODO does it make sense to create all new? Is there a possibility to say feed = res
            this.currentFeed.posts.push(
              new Post(0,0,'Post Title','Some text','https://betanews.com/wp-content/uploads/2016/10/game-of-thrones-logo.jpg',0,0,0,'','',0))
          },
          (error: any) => {
            console.log(error);
          });
      }
    );
  }


  deletePost(post: Post): void {
    console.log("Button delete works.");
    this.httpClient.post(environment.endpointURL + "post/delete", {
      postId: post.postId
    }).subscribe(() => {
      this.currentFeed.posts.splice(this.currentFeed.posts.indexOf(post), 1);
    });
  }

  updatePost(post: Post): void {
    console.log("Button update works.");
  }

}
