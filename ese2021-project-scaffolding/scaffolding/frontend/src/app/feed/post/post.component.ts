import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PostService} from "../../services/post.service";
import {Post} from "../../models/post.model";
import {environment} from "../../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{

  post: Post | undefined;
  postId: number | undefined;
  Score: number = 0;

  //Title: string = '';
  //Image: string = '';
  //Text: string = '';

  showDeleteAndUpdateButton : boolean = false;

  @Input()
  isAdmin : boolean = false;

  @Input()
  loggedIn : boolean = false;

  @Input()
  currentUser : User = new User(0, '', '', '','','','','','','','','');

  @Input()
  postToDisplay: Post = new Post(0,0,'','','',0,0,0,'','',0);
  //postToDisplay: Post = new Post(1,0,'Post Title','Some text','https://betanews.com/wp-content/uploads/2016/10/game-of-thrones-logo.jpg',0,0,0,'','',1);

  @Output()
  update = new EventEmitter<Post>();

  @Output()
  delete = new EventEmitter<Post>();

  @Output()
  upvote = new EventEmitter<Post>();

  @Output()
  downvote = new EventEmitter<Post>();

  ngOnInit() {
    this.evaluatePermission();
  }

  ngOnChanges(){
    this.evaluatePermission();
  }

  evaluatePermission(): void {
    console.log("creation user "+ this.postToDisplay.CreationUser)
    if (this.isAdmin) this.showDeleteAndUpdateButton = true;
    else if (typeof this.currentUser != 'undefined') {
      if (this.loggedIn && this.currentUser.userId == this.postToDisplay.CreationUser) this.showDeleteAndUpdateButton = true;
      else this.showDeleteAndUpdateButton = false;
    }
    else this.showDeleteAndUpdateButton = false;
  }

  updatePost(): void {
    // Emits event to parent component that Post got updated
    if (this.showDeleteAndUpdateButton){
      this.update.emit(this.postToDisplay);
    }
  }

  deletePost(): void {
    // Emits event to parent component that Post got deleted
    if (this.showDeleteAndUpdateButton){
      this.delete.emit(this.postToDisplay);
    }
  }

  upvotePost(): void {
    this.upvote.emit(this.postToDisplay);
    /*
      console.log("Upvote button works")
     this.httpClient.post(environment.endpointURL + "post/upvote", {
          postId: this.postToUpvote.postId
      }).subscribe((res: any) => {
        console.log(res);
        //this.Score = res.post.upvote - res.post.downvote;
        //this.postService.setPost(new Post(res.post.postId,this.postToUpvote.feedId,this.postToUpvote.title,
        //this.postToUpvote.text,this.postToUpvote.image,res.post.upvote,this.postToUpvote.downvote,this.Score,
        //this.postToUpvote.category,this.postToUpvote.CreationDate,this.postToUpvote.CreationUser));
      });

     */
  }

  downvotePost(): void{
    this.downvote.emit(this.postToDisplay);
    /*
    console.log("Downvote button works")
    this.httpClient.post(environment.endpointURL + "post/downvote", {
        postId: this.postToDownvote.postId
    }).subscribe((res: any) => {
      console.log(res);
      //this.Score = res.post.upvote - res.post.downvote;
      //this.postService.setPost(new Post(res.post.postId,this.postToDownvote.feedId,this.postToDownvote.title,
        //this.postToDownvote.text,this.postToDownvote.image,this.postToDownvote.upvote,res.post.downvote,this.Score,
        //this.postToDownvote.category,this.postToDownvote.CreationDate,this.postToDownvote.CreationUser));
    });

     */
  }
/*
  constructor(
    public httpClient: HttpClient,
    public postService: PostService,
  ) {
    // Listen for changes
    postService.post$.subscribe(res => this.post = res);

    // Current value
    this.post = postService.getPost();

    this.Score = this.postToDisplay.score;

    this.Title = this.postToDisplay.title;
    this.Text = this.postToDisplay.text;
    this.Image = this.postToDisplay.image;
  }

 */
}
