import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductRequestParams } from '../models/product-request-params';
import { FormService } from './form.service';
import { ShopService } from './shop.service';
import { ValidatorService } from './validator.service';


@Injectable({
  providedIn: 'root'
})
export class ProductFormService implements FormService{

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(private fb: FormBuilder,
              private httpClient: HttpClient,
              private shopService: ShopService,
              private validatorService: ValidatorService) { }


  /*******************************************************************************************************************
   * FORM BUILDER
   ******************************************************************************************************************/

  /**
   * Overrrides parents method.
   *
   * Creates form controls for product form. Inserts presets if given.
   *
   * @param preSets: product to be updated (if applicable)
   */
  buildForm(preSets?: any): FormGroup{
    return this.fb.group({
      'productId' : new FormControl(preSets? preSets.productId : ""),
      'productTitle': new FormControl(preSets? preSets.title : "", Validators.required),
      'productImage': new FormControl(preSets? preSets.image : ""),
      'productDescription': new FormControl(preSets? preSets.description: ""),
      'productCategory': new FormControl(preSets? preSets.category.id : "", Validators.required),
      'productPrice': new FormControl(preSets? preSets.price : "", Validators.compose([Validators.required,
        this.validatorService.patternValidator(/^[0-9]+(\.[0-9]{1,2})?$/, {'notValidPrice': true})]))
    }, {
      validator: (form: FormGroup) => {
        return this.validatorService.checkProduct(form);
      }}
    );
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

  /*******************************************************************************************************************
   * HELPER METHODS
   ******************************************************************************************************************/

  /**
   * Builds request parameter for backend call for product/create or product/modify.
   *
   * @param form
   * @param requestType
   */
  buildParams(form: FormGroup, requestType: string): ProductRequestParams {
    let params = {
        title: form.value.productTitle,
        description : form.value.productDescription,
        image: form.value.productImage,
        price: Number(form.value.productPrice),
        productCategory: Number(form.value.productCategory)
    };
    if(requestType.includes("create")){
      return params;
    } else {
      return {...params, productId: Number(form.value.productId)};
    }
  }
}
