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

  constructor(public httpClient: HttpClient, private fb: FormBuilder) { }

  onSubmit(formDirective: FormGroupDirective): void{}





}
