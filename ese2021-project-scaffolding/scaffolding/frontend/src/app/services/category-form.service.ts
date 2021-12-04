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
export class CategoryFormService implements FormService{

  constructor(private fb: FormBuilder,
              private httpClient: HttpClient) { }

  buildForm(preSets?: any): FormGroup{
    return this.fb.group({
      categoryName: new FormControl('', Validators.required),
    });
  }

  sendForm(form: FormGroup, requestType: any): Observable<any>{
    return this.httpClient.post(environment.endpointURL + requestType, {
      name: form?.value.categoryName,
      type: 0
    });
  }



}
