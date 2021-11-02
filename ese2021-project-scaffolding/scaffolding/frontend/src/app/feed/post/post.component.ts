import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PostService} from "../../services/post.service";
import {Post} from "../../models/post.model";
import {environment} from "../../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  post: Post | undefined;
  postId: number | undefined;
  Score: number = 0;

  Title: string = '';
  Image: string = '';
  Text: string = '';

  @Input()
  postToUpvote: Post = new Post(1,0,'','','',0,0,0,'','',1);

  @Input()
  postToDownvote: Post = new Post(1,0,'','','',0,0,0,'','',1);

  @Input()
  //postToDisplay: Post = new Post(0,0,'','','',0,0,0,'','',0);
  postToDisplay: Post = new Post(1,0,'Post Title','Some text','https://betanews.com/wp-content/uploads/2016/10/game-of-thrones-logo.jpg',0,0,0,'','',1);

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

  upvote(): void {
      console.log("Upvote button works")
     this.httpClient.post(environment.endpointURL + "post/upvote", {
        params: {
          postId: this.postId
        }
      }).subscribe((res: any) => {
        console.log(res);
        //this.Score = res.post.upvote - res.post.downvote;
        //this.postService.setPost(new Post(res.post.postId,this.postToUpvote.feedId,this.postToUpvote.title,
        //this.postToUpvote.text,this.postToUpvote.image,res.post.upvote,this.postToUpvote.downvote,this.Score,
        //this.postToUpvote.category,this.postToUpvote.CreationDate,this.postToUpvote.CreationUser));
      });
  }

  downvote(): void{
    this.httpClient.post(environment.endpointURL + "post/downvote", {
      params: {
        postId: this.postToDownvote.postId
      }
    }).subscribe((res: any) => {
      console.log(res);
      this.Score = res.post.upvote - res.post.downvote;
      this.postService.setPost(new Post(res.post.postId,this.postToDownvote.feedId,this.postToDownvote.title,
        this.postToDownvote.text,this.postToDownvote.image,this.postToDownvote.upvote,res.post.downvote,this.Score,
        this.postToDownvote.category,this.postToDownvote.CreationDate,this.postToDownvote.CreationUser));
    });
  }

  constructor(
    public httpClient: HttpClient,
    public postService: PostService,
    private route: ActivatedRoute
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

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.postId = params['postId'];
    });
  }
}
