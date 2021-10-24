import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {Post} from "../models/Post.module";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Feed} from "../models/Feed.module";





@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  postList: Post[] = [];

  currentFeed: Feed = new Feed();




  constructor(
    public userService: UserService,
    public httpClient: HttpClient
  ) {

    //current Value
    this.postList = this.createPostList();
  }

  //TODO get the right post list from backend

  // READ all created posts
  readPosts(): void {
    //TODO where do I see the right url names?
    this.httpClient.get(environment.endpointURL + "posts").subscribe((res: any) => {
      this.currentFeed = new Feed();
      res.forEach((post: any) => {
        //TODO does it make sense to create all new? Is there a possibility to say feed = res
        this.currentFeed.posts.push(new Post(post.name, post.description, post.rating, post.category));
      },
        (error: any) => {
          console.log(error);
        });
    });
  }

  // ORDER - Feed
  //TODO what is the right params?
  updateList(order: String): void {
    this.httpClient.put(environment.endpointURL + "posts/" , {
      order: order
    }).subscribe();
  }

  //TODO use right model post and feed



  ngOnInit(): void {
  }

  createPostList(): Post [] {
    let list: Post[] = [];
    for(let i = 0; i++, i<5;){
      list.push(new Post('post' + i, 'description', 5, 'category'));
    }
    return list;
  }

}
