import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

/**
 * Provides Validators for different forms.
 *
 * Used by: ProductFormService
 */
export class ValidatorService {

  constructor(private httpClient: HttpClient) { }


  /**
   * Creates a ValidatorFn Object to be used in a form that evaluates a given Regex pattern.
   *
   * @param regex: Regex pattern that should be validated
   * @param error
   */
  patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }
      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);
      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  /**
   * Evaluates if product form is valid: requires either product image or product description.
   *
   * @param form: Form to be evaluated.
   */
  checkProduct(form: FormGroup): {[s: string]: boolean} | null{
    if(form.value.productImage == "" && form.value.productDescription == ""){
      console.log("error");
      return {'missingProductContent': true};
    }
    console.log("correct");
    return null;
  };


  checkPost(form: FormGroup): {[s: string]: boolean} | null{
    if(form.value.postImage == "" && form.value.postText == ""){
      console.log("error");
      return {'missingPostContent': true};
    }
    console.log("correct");
    return null;
  };

  /*******************************************************************************************************************
   * REGISTRATION FORM
   ******************************************************************************************************************/

  userNameInUseValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      const promise = new Promise<any>((resolve, reject) => {
        this.httpClient.post(environment.endpointURL + "user/checkUserNameOrEmailInUse", {
          userName: control.value
        }).subscribe((res: any) => {
          if (res.inUse == true) {
            resolve({userNameInUse: true});
          } else {
            resolve(null);
          }
        }, error => {
          console.log(error);
        });
      });
      return promise;
    }
  }


  emailInUseValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      const promise = new Promise<any>((resolve, reject) => {
        this.httpClient.post(environment.endpointURL + "user/checkUserNameOrEmailInUse", {
          email: control.value
        }).subscribe((res: any) => {
          if (res.inUse == true) {
            resolve({emailInUse: true});
          } else {
            resolve(null);
          }
        }, error => {
          console.log(error);
        });
      });
      return promise;
    };
  }






}
