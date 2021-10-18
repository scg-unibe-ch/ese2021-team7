import { Component, OnInit } from '@angular/core';
import {User} from "../models/user.model";
import {UserService} from "../services/user.service";
import {Post} from "../models/Post.module";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  postList: Post[] = [];

  loggedIn: boolean | undefined;

  user: User | undefined;

  constructor(
    public userService: UserService
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    userService.user$.subscribe(res => this.user = res);

    //current Value
    this.loggedIn = userService.getLoggedIn();
    this.user = userService.getUser();

    this.postList = this.createPostList();
  }

  //TODO get the right post list from backend

  //TODO use right model post



  ngOnInit(): void {
  }

  createPostList(): Post [] {
    let list: Post[] = [];
    for(let i = 0; i++, i<5;){
      list.push(new Post("post" + i));
    }
    return list;
  }

}
