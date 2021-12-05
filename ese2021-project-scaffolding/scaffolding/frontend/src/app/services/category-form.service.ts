import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FormType } from '../models/form-type';
import { FormService } from './form.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Handles form creation and backend connection for the category form.
 *
 * @implements FormService
 *
 */
export class CategoryFormService implements FormService{

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(private fb: FormBuilder,
              private httpClient: HttpClient) { }

  /*******************************************************************************************************************
   * FORM BUILDER
   ******************************************************************************************************************/

  /**
   * Overrrides parents method.
   *
   * Creates form controls for category form.
   *
   * Form fields: category name, category type
   *
   * @param preSets: category form does not have presets
   */
  buildForm(preSets?: any): FormGroup{
    return this.fb.group({
      categoryName: new FormControl('', Validators.required),
      categoryType: new FormControl('', Validators.required)
    });
  }

  /*******************************************************************************************************************
   * BACKEND HANDLER
   ******************************************************************************************************************/

  /**
   * Overrides parents method.
   *
   * Sends category/create request to backend.
   *
   * Backend params: name, type
   *
   * @param form: category form
   * @param requestType: category/create
   */
  sendForm(form: FormGroup, requestType: any): Observable<any>{
    return this.httpClient.post(environment.endpointURL + requestType, {
      name: form?.value.categoryName,
      type: Number(form?.value.categoryType)
    });
  }



}
