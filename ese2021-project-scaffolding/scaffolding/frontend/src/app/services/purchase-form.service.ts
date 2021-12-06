import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FormService } from './form.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseFormService implements FormService {

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
   * Creates form controls for purchase form.
   *
   * productId, userId are intialized as FormControls but never shown in the DOM.
   * This is done, so all the data for the backend is contained in the form.
   *
   * @param preSets: User, Product
   */
  buildForm(preSets?: any): FormGroup {
    return this.fb.group({
      paymentMethod: new FormControl("1", Validators.required),
      firstName: new FormControl(preSets.presetUser.firstName, Validators.required),
      lastName: new FormControl(preSets.presetUser.lastName, Validators.required),
      street: new FormControl(preSets.presetUser.street, Validators.required),
      houseNumber: new FormControl(preSets.presetUser.houseNumber),
      zipCode: new FormControl(preSets.presetUser.zipCode),
      city: new FormControl(preSets.presetUser.city),
      productId: new FormControl(preSets.presetProduct.productId),
      userId: new FormControl(preSets.presetUser.userId)
    });
  }

  /*******************************************************************************************************************
   * BACKEND HANDLER
   ******************************************************************************************************************/

  /**
   * Overrides parents method.
   *
   * Sends 'order/create" request to backend.
   **
   * @param form: purchase form
   * @param requestType: order/create
   */
  sendForm(form: FormGroup, requestType: any): Observable<any> {
    return this.httpClient.post(environment.endpointURL + requestType, {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      street: form.value.street,
      houseNr: form.value.houseNumber,
      zip: form.value.zipCode,
      city: form.value.city,
      paymentOption: form.value.paymentMethod,
      user: Number(form.value.userId), //number
      productId: Number(form.value.productId) //number
    } );
  }
}
