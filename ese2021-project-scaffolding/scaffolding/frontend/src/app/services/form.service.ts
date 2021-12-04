import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FormType } from '../models/form-type';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private fb: FormBuilder,
              private httpClient: HttpClient) { }

  formBuilderFactory(formType: FormType, preSets?: any): FormGroup{
    switch(formType){
      case FormType.Category:
        return this.initializeCategoryForm();
      default:
        return this.fb.group({},{});
    };
  }

  initializeCategoryForm(): FormGroup {
    return this.fb.group({
      categoryName: new FormControl('', Validators.required),
    });
  }

  sendForm(form: FormGroup, formType: any, requestType: any): Observable<any>{
    switch(formType){
      case FormType.Category:
        return this.sendCategoryForm(form, requestType);
      default:
        return of({error: "Could not send request."});
    };
  }

  sendCategoryForm(form: FormGroup, requestType: any): Observable<any> {
    return this.httpClient.post(environment.endpointURL + requestType, {
      name: form?.value.categoryName,
      type: 0
    });
    }


}
