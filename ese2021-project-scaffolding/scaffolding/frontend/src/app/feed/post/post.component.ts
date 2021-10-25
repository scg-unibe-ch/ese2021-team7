import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PostService} from "../../services/post.service";
import {Post} from "../../models/post.model";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {

  post: Post | undefined;

  Title: string = '';
  Image: string = '';
  Text: string = '';
  score: number = 0;

  postToUpvote: Post = new Post(0,0,'','','',0,0,0,'','',0);
  postToDownvote: Post = new Post(0,0,'','','',0,0,0,'','',0);

  @Input()
  //postToDisplay: Post = new Post(0,0,'','','',0,0,0,'','',0);
  postToDisplay: Post = new Post(0,0,'Post Title','Some text','https://betanews.com/wp-content/uploads/2016/10/game-of-thrones-logo.jpg',0,0,0,'','',0);

  @Output()
  update = new EventEmitter<Post>();

  @Output()
  delete = new EventEmitter<Post>();

  updatePost(): void {
    // Emits event to parent component that Post got updated
    this.update.emit(this.post);
  }

  deletePost(): void {
    // Emits event to parent component that Post got deleted
    this.delete.emit(this.post);
  }

  upvote(): void{
    this.httpClient.post(environment.endpointURL + "post/upvote", {
      postId: this.postToUpvote.postId
    }).subscribe((res: any) => {
      console.log(res);
      this.score = res.post.upvote - res.post.downvote;
      this.postService.setPost(new Post(res.post.postId,this.postToUpvote.feedId,this.postToUpvote.title,
        this.postToUpvote.text,this.postToUpvote.image,res.post.upvote,this.postToUpvote.downvote,this.score,
        this.postToUpvote.category,this.postToUpvote.CreationDate,this.postToUpvote.CreationUser));
    });
  }

  downvote(): void{
    this.httpClient.post(environment.endpointURL + "post/downvote", {
      postId: this.postToDownvote.postId
    }).subscribe((res: any) => {
      console.log(res);
      this.score = res.post.upvote - res.post.downvote;
      this.postService.setPost(new Post(res.post.postId,this.postToDownvote.feedId,this.postToDownvote.title,
        this.postToDownvote.text,this.postToDownvote.image,this.postToDownvote.upvote,res.post.downvote,this.score,
        this.postToDownvote.category,this.postToDownvote.CreationDate,this.postToDownvote.CreationUser));
    });
  }

  constructor(
    public httpClient: HttpClient,
    public postService: PostService
  ) {
    // Listen for changes
    postService.post$.subscribe((res: Post | undefined) => this.post = res);

    // Current value
    this.post = postService.getPost();

    this.Title = this.postToDisplay.title;
    this.Text = this.postToDisplay.text;
    this.Image = this.postToDisplay.image;
  }
}
