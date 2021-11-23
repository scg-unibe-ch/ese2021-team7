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

  isReadMore = false;

  //used for handling "Read More" functionality
  fullText:  string | undefined;
  shortText:  string | undefined;
  postTooLong = false;

  @Input()
  loggedIn : boolean = false;

  @Input()
  currentUser : User = new User(0, '', '', false,'','','','','','','','','');

  @Input()
  postToDisplay: Post = new Post(0,0,'','','',0,0,0,'','',0,'');

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
    this.evaluateVotingButtonsPermission();
    this.createFullTextAndShortText();
  }

  ngOnChanges(){
    this.evaluateUpdateDeletePermission();
    this.evaluateVotingButtonsPermission();
  }

  evaluateUpdateDeletePermission(): void {
    // set true if user is admin or if user is creator of post
    if (typeof this.currentUser != 'undefined') {
      if (this.currentUser.isAdmin) this.showDeleteAndUpdateButton = true;
      else if (this.loggedIn && this.currentUser.userId == this.postToDisplay.CreationUser) this.showDeleteAndUpdateButton = true;
      else this.showDeleteAndUpdateButton = false;
    }
    else this.showDeleteAndUpdateButton = false;
  }

  evaluateVotingButtonsPermission(){
    // set true only if logged in and user is not creator
    if (typeof this.currentUser != 'undefined') {
      if (this.currentUser.isAdmin){
        this.showVotingButtons = false;
      }
      else if (this.loggedIn && this.currentUser.userId != this.postToDisplay.CreationUser){
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
    // Emits event to parent component that Post got upvoted
    if (this.showVotingButtons){
      this.upvote.emit(this.postToDisplay);
    }
  }

  downvotePost(): void{
    // Emits event to parent component that Post got downvoted
    if (this.showVotingButtons) {
      this.downvote.emit(this.postToDisplay);
    }
  }

  /**
   * Changes value of isReadMore.
   *
   * Exectued when user clicks on 'More'/'Less' button.
   *
   */
  showText(): void{
    this.isReadMore = !this.isReadMore;
  }

  /**
   * Checks if post text is longer than 150 characters. If so, sets readMore to true and creates short Version.
   *
   */
  createFullTextAndShortText(): void{
    this.fullText = this.postToDisplay.text;
    if(this.fullText.length > 150){
      this.postTooLong = true;
      this.isReadMore = true;
      this.shortText = this.fullText.substring(0,150) + "... ";
    }
  }
}
