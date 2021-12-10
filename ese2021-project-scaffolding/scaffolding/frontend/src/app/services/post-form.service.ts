import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { PostRequestParams } from '../models/post-request-params';
import { FormService } from './form.service';
import { ValidatorService } from './validator.service';

@Injectable({
  providedIn: 'root'
})
export class PostFormService implements FormService {

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private validatorService: ValidatorService
  ) { }


  /*******************************************************************************************************************
   * FORM BUILDER
   ******************************************************************************************************************/

  /**
   * Overrrides parents method.
   *
   * Creates form controls for post form. Inserts presets if given.
   *
   * @param preSets: post to be updated (if applicable)
   */
  buildForm(preSets?: any): FormGroup{
    //console.log("Presets: " + JSON.stringify(preSets));
    return this.fb.group({
      "postTitle": new FormControl(preSets? preSets.title : "", Validators.required),
      "postImage": new FormControl(preSets? preSets.image : ""),
      "postText": new FormControl(preSets? preSets.text : ""),
      "postCategory": new FormControl(preSets? preSets.category.id: "", Validators.required),
      "postId": new FormControl(preSets? preSets.postId : "")
    }, {
      validator: (form: FormGroup) => {
        return this.validatorService.checkPost(form);
      }
    });
  }

  /*******************************************************************************************************************
   * BACKEND HANDLER
   ******************************************************************************************************************/

  /**
   * Overrides parents method.
   *
   * Sends product/create or product/modify request to backend.
   *
   * Calls buildParams to build specific request paramter.
   *
   * @param form: product form
   * @param requestType: product/create or product modify
   */
  sendForm(form: FormGroup, requestType: any): Observable<any>{
    return this.httpClient.post(environment.endpointURL + requestType, this.buildParams(form, requestType));
  }

  /**
   * Builds request parameter for backend call for product/create or product/modify.
   *
   * @param form
   * @param requestType
   */
  buildParams(form: FormGroup, requestType: string): PostRequestParams {
    let params = {
      title: form.value.postTitle,
      text : form.value.postText,
      image: form.value.postImage,
      category: Number(form.value.postCategory),
    };
    if(requestType.includes("create")){
      return params;
    } else {
      return {...params, postId: Number(form.value.postId)};
    }
  }



}
