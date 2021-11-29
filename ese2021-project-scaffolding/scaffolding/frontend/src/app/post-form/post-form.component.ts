import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import {FormControl, FormGroup, FormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl, FormGroupDirective} from '@angular/forms';
import { Post } from '../models/post.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
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

  constructor(public httpClient: HttpClient, private fb: FormBuilder, public userService: UserService, private route: ActivatedRoute, private router: Router) {
    this.isSubmitted= false;
    this.isCreate = false;
    this.isUpdate = false;
  }

  ngOnInit(): void {
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
        }).subscribe((res: any) => {
          console.log(res);
          this.post = new Post(res.postId, 0, res.title, res.text, res.image, res.upvote, res.downvote, 0, res.category, res.createdAt, res.UserUserId,'');
          console.log(this.post);
          this.initializeFormUpdate();
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
      "postCategory": new FormControl(this.post?.category, Validators.required)
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
      upvote: this.post?.upvote,
      downvote: this.post?.downvote
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
  checkPost(form: FormGroup): {[s: string]: boolean}{
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
