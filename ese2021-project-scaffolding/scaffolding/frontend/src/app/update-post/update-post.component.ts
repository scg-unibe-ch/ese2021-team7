import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import {FormControl, FormGroup, FormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl, FormGroupDirective} from '@angular/forms';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent implements OnInit {

  updateFormPost: FormGroup | undefined;

  file: File;

  postNumber = 1;

  post: Post | undefined;

  filename = '';

  isSubmitted: boolean;

  constructor(public httpClient: HttpClient, private fb: FormBuilder, public userService: UserService) {
    this.isSubmitted= false;
  }


  ngOnInit(): void {
    this.httpClient.get(environment.endpointURL + "post/byId", {
      params: {
        postId: 1
      }
    }).subscribe( (res:any) => {
      console.log(res);
      this.post = new Post(res.postId, null, res.title, res.text, res.image, res.upvote, res.downvote, null, res.category, res.createdAt, res.UserUserId);
      console.log(this.post);
      this.updateFormPost = this.fb.group({
        "postTitle": new FormControl(this.post.title, Validators.required),
        "postImage" : new FormControl(this.post.image),
        "postText" : new FormControl(this.post.text)
      }, {
        validator: (form: FormGroup) => {return this.checkPost(form);}
      });

    }, (error: any) => {
      console.log(error);
    });
  }

  onSubmit(formDirective: FormGroupDirective): void{
    console.log(this.updateFormPost)
    this.isSubmitted = true;
    if(this.updateFormPost.valid){
      this.httpClient.post(environment.endpointURL + "post/modify", {
        postId: this.post.postId,
        title: this.updateFormPost.value.postTitle,
        text: this.updateFormPost.value.postText,
        image: this.updateFormPost.value.postImage,
        category: this.post.category,
        upvote: this.post.upvote,
        downvote: this.post.downvote
      }, ).subscribe((res: any) => {
          console.log(res);
          this.isSubmitted = false;
        },
        (error: any) =>{
          console.log(error);
          this.isSubmitted = false;
        });
    }
  }

  onFileSelected(event: any){
    this.file = event.target.files[0];
    this.filename = this.file.name;
    if(this.updateFormPost.value.postImage){
      console.log(this.filename);
      console.log(this.updateFormPost.value.postImage);
    }
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

}