import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class FormService {

  abstract buildForm(preSets?: any): FormGroup;

  abstract sendForm(form: FormGroup, requestType: any): Observable<any>;

}


