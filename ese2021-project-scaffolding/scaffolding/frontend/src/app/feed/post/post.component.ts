import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Category } from 'src/app/models/category';
import { PermissionService } from 'src/app/services/permission.service';
import {Post} from "../../models/post.model";
import {User} from "../../models/user.model";
import {VotingState} from "../../models/voting-state";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  Score: number = 0;

  //flags for permissions
  showDeleteAndUpdateButton : boolean = false;
  showVotingButtons : boolean = false;
  enableUpvote: boolean = false;
  enableDownvote: boolean = false;


  //used for handling "Read More" functionality
  isReadMore = false;
  fullText:  string | undefined;
  shortText:  string | undefined;
  postTooLong = false;

  /*******************************************************************************************************************
   * INPUTS
   ******************************************************************************************************************/

  @Input()
  loggedIn : boolean = false;

  @Input()
  currentUser: User | undefined;


  @Input()
  postToDisplay: Post = new Post(0,'','','',0,new Category(0, "undefined", 0, "undefined"),0,'', VotingState.NotAllowed);

  /*******************************************************************************************************************
   * OUPUTS
   ******************************************************************************************************************/

  @Output()
  update = new EventEmitter<Post>();

  @Output()
  delete = new EventEmitter<Post>();

  @Output()
  upvote = new EventEmitter<Post>();

  @Output()
  downvote = new EventEmitter<Post>();

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    private permissionService: PermissionService) {}



  ngOnInit() {
    this.showDeleteAndUpdateButton = this.permissionService.checkPermissionsPostUpdateAndDelete(this.loggedIn, this.currentUser, this.postToDisplay);
    this.showVotingButtons = this.permissionService.checkPermissionsShowVotingButtons(this.loggedIn, this.currentUser, this.postToDisplay);
    this.enableUpvote = this.permissionService.checkPermissionsUpvote(this.loggedIn, this.currentUser, this.postToDisplay);
    this.enableDownvote = this.permissionService.checkPermissionsDownvote(this.loggedIn, this.currentUser, this.postToDisplay);
    this.createFullTextAndShortText();
  }

  ngOnChanges(){
    this.showDeleteAndUpdateButton = this.permissionService.checkPermissionsPostUpdateAndDelete(this.loggedIn, this.currentUser, this.postToDisplay);
    this.showVotingButtons = this.permissionService.checkPermissionsShowVotingButtons(this.loggedIn, this.currentUser, this.postToDisplay);
    this.enableUpvote = this.permissionService.checkPermissionsUpvote(this.loggedIn, this.currentUser, this.postToDisplay);
    this.enableDownvote = this.permissionService.checkPermissionsDownvote(this.loggedIn, this.currentUser, this.postToDisplay);
  }

  /**
   * Emits event to parent component that Post got updated
   */
  updatePost(): void {
    if (this.showDeleteAndUpdateButton){
      this.update.emit(this.postToDisplay);
    }
  }

  /**
   * Emits event to parent component that Post got deleted
   */
  deletePost(): void {
    if (this.showDeleteAndUpdateButton){
      this.delete.emit(this.postToDisplay);
    }
  }

  /**
   * Emits event to parent component that Post got upvoted
   */
  upvotePost(): void {
    if (this.showVotingButtons && this.enableUpvote){
      this.postToDisplay.votingState = VotingState.Upvoted;
      this.enableDownvote = true;
      this.enableUpvote = false;
      this.upvote.emit(this.postToDisplay);
    }
  }

  /**
   * Emits event to parent component that Post got downvoted
   */
  downvotePost(): void {
    if (this.showVotingButtons && this.enableDownvote) {
      this.postToDisplay.votingState = VotingState.Downvoted;
      this.enableDownvote = false;
      this.enableUpvote = true;
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
