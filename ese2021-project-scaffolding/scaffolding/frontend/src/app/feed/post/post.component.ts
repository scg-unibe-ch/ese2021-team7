import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../services/user.service";
import {Post} from "../../models/post.model";

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

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {
    this.Title = this.postToDisplay.title;
    this.Text = this.postToDisplay.text;
    this.Image = this.postToDisplay.image;
  }
}
