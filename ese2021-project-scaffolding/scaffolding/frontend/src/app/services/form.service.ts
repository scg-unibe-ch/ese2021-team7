import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Responsible for reactively creating forms and backend requests.
 *
 * Used as interface for services.
 *
 * @use: CategoryService
 */
export abstract class FormService {

  /**
   * Creates form controls and returns FormGroup.
   *
   * @param preSets: if form needs to be pre-polated
   */
  abstract buildForm(preSets?: any): FormGroup;

  /**
   * Sends form to backend.
   *
   * @param form: form to be sent
   * @param requestType: html request
   */
  abstract sendForm(form: FormGroup, requestType: any): Observable<any>;

}


