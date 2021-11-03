import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from "../../models/post.model";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{

  post: Post | undefined;
  postId: number | undefined;
  Score: number = 0;

  showDeleteAndUpdateButton : boolean = false;
  showVotingButtons : boolean = false;

  @Input()
  isAdmin : boolean = false;

  @Input()
  loggedIn : boolean = false;

  @Input()
  currentUser : User = new User(0, '', '', '','','','','','','','','');

  @Input()
  postToDisplay: Post = new Post(0,0,'','','',0,0,0,'','',0);

  @Output()
  update = new EventEmitter<Post>();

  @Output()
  delete = new EventEmitter<Post>();

  @Output()
  upvote = new EventEmitter<Post>();

  @Output()
  downvote = new EventEmitter<Post>();

  ngOnInit() {
    this.evaluateUpdateDeletePermission();
    this.evaluateVotingButtons();
  }

  ngOnChanges(){
    this.evaluateUpdateDeletePermission();
    this.evaluateVotingButtons();
  }

  evaluateUpdateDeletePermission(): void {
    // set true if user is admin or if user is creator of post
    if (this.isAdmin) this.showDeleteAndUpdateButton = true;
    else if (typeof this.currentUser != 'undefined') {
      if (this.loggedIn && this.currentUser.userId == this.postToDisplay.CreationUser) this.showDeleteAndUpdateButton = true;
      else this.showDeleteAndUpdateButton = false;
    }
    else this.showDeleteAndUpdateButton = false;
  }

  evaluateVotingButtons(){
    // set true only if logged in and user is not creator
    if (this.isAdmin){
      this.showVotingButtons = false;
    }
    else if (typeof this.currentUser != 'undefined') {
      if (this.loggedIn && this.currentUser.userId != this.postToDisplay.CreationUser){
        this.showVotingButtons = true;
      }
      else this.showVotingButtons = false;
    }
    else this.showVotingButtons = false;
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
  }

  downvotePost(): void{
    this.downvote.emit(this.postToDisplay);
  }
}
