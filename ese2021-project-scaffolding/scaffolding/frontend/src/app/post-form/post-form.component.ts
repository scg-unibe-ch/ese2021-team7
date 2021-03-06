import {Component, Inject, Injector, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { FormGroup } from '@angular/forms';
import {Post} from '../models/post.model';
import {ActivatedRoute } from '@angular/router';
import { PostService } from '../services/post.service';
import { PostFormService } from '../services/post-form.service';
import { FormType } from '../models/form-type';
import { BaseFormComponent } from '../base-form/base-form.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent extends BaseFormComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  // overrides parent variables
  protected formType = FormType.Product;
  form: FormGroup = new FormGroup({});
  requestType = "";

  post: Post | undefined;

  isSubmitted: boolean = false;

  isCreate: boolean = false;
  isUpdate: boolean = false;

  isLoading: boolean = false;

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private dialogRef: MatDialogRef<PostFormComponent>,
    public injector: Injector,
    @Inject(MAT_DIALOG_DATA) public dialogData: {isUpdate: boolean, isCreate: boolean, postId: number, userId: number},
   public postFormService: PostFormService,
    private httpClient: HttpClient) {
    super(postFormService, injector);
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit(): void {
    super.ngOnInit();
    super.evaluateAccessPermissions();
    this.setUpFormType();
  }

  /*******************************************************************************************************************
   * USER ACTIONS
   ******************************************************************************************************************/

  /**
   * Closes dialog box if user clicks on "Discard" button.
   */
  discardChanges(): void {
    this.dialogRef.close(); //closes dialog box
  }

  /*******************************************************************************************************************
   * HELPER METHODS
   ******************************************************************************************************************

   /**
   * Checks whether form is used to create or update post.
   *
   * Initializes form with the right parameters.
   *
   * In case of update, gets post from backend.
   */
  setUpFormType(): void{
    if(this.dialogData.isUpdate){
      //set parameters
      this.isUpdate = true;
      this.isCreate= false;
      this.isLoading = true;
      this.requestType = "post/modify";
      this.httpClient.get(environment.endpointURL + "post/byId", {
        params: {
          postId: this.dialogData.postId
        }
      }).subscribe((post: any) => {
        let category = this.categoryService.getCategoryById(post.category);
        this.httpClient.get(environment.endpointURL + "user/getById", {
          params: {
            userId: this.dialogData.userId
          }
        }).subscribe( (user:any) => {
            this.post = this.postService.createPostFromBackendResponse(post, category, user);
            super.initializeForm(this.post); //initialize form with preset
          this.isLoading = false;
          }
        );
      }, (error: any) => {
        console.log(error);
      });
    } else if(this.dialogData.isCreate) {
      this.isUpdate = false;
      this.isCreate= true;
      this.requestType = "post/create";
      this.initializeForm(); //initialize form empty
    }
  }

  /**
   * Closes dialog box.
   * Overrides parents method.
   *
   * @param route: not used
   * @param queryParams: not used
   */
  reRouteAfterSuccess(route: string, queryParams?: any): void {
    this.dialogRef.close();
  }


}
