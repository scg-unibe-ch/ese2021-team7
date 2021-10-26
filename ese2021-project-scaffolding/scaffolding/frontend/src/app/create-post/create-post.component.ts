import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import {FormControl, FormGroup, FormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl, FormGroupDirective} from '@angular/forms';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent{

  createPostForm = this.fb.group({
    postTitle: new FormControl('', Validators.required),
    postImage : new FormControl(''),
    postText : new FormControl('')
  });


  file: File;

  filename = '';

  constructor(public httpClient: HttpClient, private fb: FormBuilder, public userService: UserService) { }

  onSubmit(formDirective: FormGroupDirective): void{
    console.log(this.createPostForm)
    if(this.createPostForm.valid){
      this.httpClient.post(environment.endpointURL + "post/create", {
        title: this.createPostForm.value.postTitle,
        text: this.createPostForm.value.postText,
        image: this.createPostForm.value.postImage,
      }, ).subscribe((res: any) => {
          console.log(res);
        },
        (error: any) =>{
          console.log(error);
        });
    }
  }


  onFileSelected(event: any){
    this.file = event.target.files[0];
    this.filename = this.file.name;
    if(this.createPostForm.value.postImage){
      console.log(this.filename);
      console.log(this.createPostForm.value.postImage);
    }
  }


/*
  //currently not set
  checkPost(control: AbstractControl): {[s: string]: boolean}{
    if(this.createPostForm.value.postImage == "" && this.createPostForm.value.postImage == ""){
      return {'missingPostContent': true};
    }
    return null;
  };
  */


/*
  postCompleteValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.createPostForm.value.postImage == "" && this.createPostForm.value.postImage == ""){
        console.log("error");
        return {'missingPostContent': true};
      }
      console.log("correct");
      return null;
    };
  }
*/
}
