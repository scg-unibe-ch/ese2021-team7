import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {UserService} from '../services/user.service';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Post} from '../models/post.model';
import {ActivatedRoute, Router} from '@angular/router';
import {VotingState} from "../models/voting-state";
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { UserBackendService } from '../services/user-backend.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  postForm: FormGroup | undefined;

  postId: number | undefined;

  post: Post | undefined;

  isSubmitted: boolean;

  isCreate: boolean;

  isUpdate: boolean;

  // array with post categories
  postCategories: Category[] = [];

  constructor(
    public httpClient: HttpClient,
    private fb: FormBuilder,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private userBackendService: UserBackendService,
    private postService: PostService) {
    this.isSubmitted= false;
    this.isCreate = false;
    this.isUpdate = false;
  }

  ngOnInit(): void {
    //set up categories
    //listener for product categories
    this.categoryService.postCategories$.subscribe(res => this.postCategories = res);
    //current value of product categories
    this.postCategories = this.categoryService.getPostCategories();

    this.route.queryParams.subscribe(params => {
      if(params['create'] == 'true'){
        this.isCreate = params['create'];
      }
      else if(params['update'] == 'true'){
        this.isUpdate = params['update']
        this.postId = params['postId'];
      }
    });
    if(this.isCreate){
      this.initializeFormCreate();
    }
    else if(this.isUpdate){
      if(this.postId != null) {
        this.httpClient.get(environment.endpointURL + "post/byId", {
          params: {
            postId: this.postId
          }
        }).subscribe((post: any) => {
          console.log(post);
          let category = this.categoryService.getCategoryById(post.category);
          this.httpClient.get(environment.endpointURL + "user/getById", {
            params: {
              userId: post.UserUserId
            }
          }).subscribe( (user:any) => {
            this.post = this.postService.createPostFromBackendResponse(post, category, user);
            console.log(this.post);
            this.initializeFormUpdate();
            }
          );
        }, (error: any) => {
          console.log(error);
        });
      }
    }
  }


  initializeFormCreate(): void {
    this.postForm = this.fb.group({
      postTitle: new FormControl('', Validators.required),
      postImage : new FormControl(''),
      postText : new FormControl(''),
      postCategory : new FormControl('', Validators.required)
    }, {
      validator: (form: FormGroup) => {return this.checkPost(form);}
    });
  }

  initializeFormUpdate(): void {
    this.postForm = this.fb.group({
      "postTitle": new FormControl(this.post?.title, Validators.required),
      "postImage": new FormControl(this.post?.image),
      "postText": new FormControl(this.post?.text),
      "postCategory": new FormControl(this.post?.category.id, Validators.required)
    }, {
      validator: (form: FormGroup) => {
        return this.checkPost(form);
      }
    });
  }

  onSubmit(formDirective: FormGroupDirective): void{
    console.log(this.postForm)
    this.isSubmitted = true;
    if(this.postForm?.valid){
      if(this.isCreate){
        this.sendCreateForm();
      }
      else if (this.isUpdate) {
        this.sendUpdateForm();
      }
    }
  }

  sendCreateForm(): void {
    this.httpClient.post(environment.endpointURL + "post/create", {
      title: this.postForm?.value.postTitle,
      text: this.postForm?.value.postText,
      image: this.postForm?.value.postImage,
      category: this.postForm?.value.postCategory
    }, ).subscribe((res: any) => {
        console.log(res);
        this.isSubmitted = false;
        this.router.navigate(['/feed'], {queryParams: {loggedIn: 'true'}}).then(r =>{});
      },
      (error: any) =>{
        console.log(error);
        this.isSubmitted = false;
      });
    }

  sendUpdateForm(): void {
    this.httpClient.post(environment.endpointURL + "post/modify", {
      postId: this.post?.postId,
      title: this.postForm?.value.postTitle,
      text: this.postForm?.value.postText,
      image: this.postForm?.value.postImage,
      category: this.postForm?.value.postCategory,
    }, ).subscribe((res: any) => {
        console.log(res);
        this.isSubmitted = false;
        this.router.navigate(['/feed'], {queryParams: {loggedIn: 'true'}}).then(r =>{});
      },
      (error: any) =>{
        console.log(error);
        this.isSubmitted = false;
      });
    }

  //currently not set
  checkPost(form: FormGroup): {[s: string]: boolean} | null{
    if(form.value.postImage == "" && form.value.postText == ""){
      console.log("error");
      return {'missingPostContent': true};
    }
    console.log("correct");
    return null;
  };

  discardChanges(): void {
    this.isSubmitted = false;
    this.router.navigate(['/feed'], {queryParams: {loggedIn: 'true'}}).then(r =>{});
  }
}
