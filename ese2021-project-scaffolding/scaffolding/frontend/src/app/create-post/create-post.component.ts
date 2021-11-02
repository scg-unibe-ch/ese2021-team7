import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import {FormControl, FormGroup, FormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl, FormGroupDirective} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {

  createPostForm = this.fb.group({
    postTitle: new FormControl('', Validators.required),
    postImage : new FormControl(''),
    postText : new FormControl('')
  }, {
    validator: (form: FormGroup) => {return this.checkPost(form);}
  });


  file: File;

  filename = '';

  isSubmitted: boolean;

  constructor(public httpClient: HttpClient, private fb: FormBuilder, public userService: UserService, private router: Router) {
    this.isSubmitted= false;
  }

  onSubmit(formDirective: FormGroupDirective): void{
    console.log(this.createPostForm)
    this.isSubmitted = true;
    if(this.createPostForm.valid){
      this.httpClient.post(environment.endpointURL + "post/create", {
        title: this.createPostForm.value.postTitle,
        text: this.createPostForm.value.postText,
        image: this.createPostForm.value.postImage,
      }, ).subscribe((res: any) => {
          console.log(res);
          this.isSubmitted = false;
          this.router.navigate(['/feed'], {queryParams : {loggedIn : 'true'}});
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
    if(this.createPostForm.value.postImage){
      console.log(this.filename);
      console.log(this.createPostForm.value.postImage);
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
