import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { AccessPermission } from 'src/app/models/access-permission';
import { Category } from 'src/app/models/category';
import { FeaturePermission } from 'src/app/models/feature-permission';
import { PermissionService } from 'src/app/services/permission.service';
import {Post} from "../../models/post.model";
import {User} from "../../models/user.model";
import {VotingState} from "../../models/voting-state";
import {House} from "../../models/house";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  //post: Post | undefined;
  //postId: number | undefined;
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
  //currentUser: User = new User(0, '', '', false,'','','','','','','','','', new AccessPermission(false, false, false, false, false, false, false, false), new FeaturePermission(false, false, false, false));
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
    //this.evaluateUpdateDeletePermission();
    //this.evaluateVotingButtonsPermission();
    this.showDeleteAndUpdateButton = this.permissionService.checkPermissionsPostUpdateAndDelete(this.loggedIn, this.currentUser, this.postToDisplay);
    this.showVotingButtons = this.permissionService.checkPermissionsShowVotingButtons(this.loggedIn, this.currentUser, this.postToDisplay);
    this.enableUpvote = this.permissionService.checkPermissionsUpvote(this.loggedIn, this.currentUser, this.postToDisplay);
    this.enableDownvote = this.permissionService.checkPermissionsDownvote(this.loggedIn, this.currentUser, this.postToDisplay);
    this.createFullTextAndShortText();
  }

  ngOnChanges(){
    //this.evaluateUpdateDeletePermission();
    //this.evaluateVotingButtonsPermission();
    this.showDeleteAndUpdateButton = this.permissionService.checkPermissionsPostUpdateAndDelete(this.loggedIn, this.currentUser, this.postToDisplay);
    this.showVotingButtons = this.permissionService.checkPermissionsShowVotingButtons(this.loggedIn, this.currentUser, this.postToDisplay);
    this.enableUpvote = this.permissionService.checkPermissionsUpvote(this.loggedIn, this.currentUser, this.postToDisplay);
    this.enableDownvote = this.permissionService.checkPermissionsDownvote(this.loggedIn, this.currentUser, this.postToDisplay);
  }

  /*evaluateUpdateDeletePermission(): void {
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
        this.enableUpvote = this.enableDownvote = false;
      }
      else if (this.loggedIn && this.currentUser.userId != this.postToDisplay.CreationUser){
        this.showVotingButtons = true;
        // check if user already voted
        switch (this.postToDisplay.votingState){
          case VotingState.NotVoted: {
            this.enableUpvote = this.enableDownvote = true;
            break;
          }
          case VotingState.Upvoted: {
            this.enableUpvote = false;
            this.enableDownvote = true;
            break;
          }
          case VotingState.Downvoted: {
            this.enableUpvote = true;
            this.enableDownvote = false;
            break;
          }
          default: {
            this.enableDownvote = this.enableUpvote = false;
          }
        }
      }
      else this.showVotingButtons = false;
    }
    else this.showVotingButtons = false;
  }*/

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
    if (this.showVotingButtons && this.enableUpvote){
      this.postToDisplay.votingState = VotingState.Upvoted;
      this.enableDownvote = true;
      this.enableUpvote = false;
      this.upvote.emit(this.postToDisplay);
    }
  }

  downvotePost(): void{
    // Emits event to parent component that Post got downvoted
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
