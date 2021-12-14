import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FormService } from './form.service';

@Injectable({
  providedIn: 'root'
})
export class SelectHouseFormService implements FormService {

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
   * Creates form controls for Select House form.
   *
   * @param preSets: User, Product
   */
  buildForm(preSets?: any): FormGroup {
    return this.fb.group({
      house: [preSets? preSets.houseId : "", Validators.required],
      userId: [preSets.userId]
    });

  }

  /*******************************************************************************************************************
   * BACKEND HANDLER
   ******************************************************************************************************************/

  /**
   * Overrides parents method.
   *
   * @param form: house select form
   * @param requestType:
   */
  sendForm(form: FormGroup, requestType: any): Observable<any> {
    return this.httpClient.post(environment.endpointURL + requestType, {
      userId: Number(form.value.userId),
      houseId: Number(form.value.house) //number
    } );
  }



}
