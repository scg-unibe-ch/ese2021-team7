import { Injectable } from '@angular/core';
import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

/**
 * Provides Validators for different forms.
 *
 * Used by: ProductFormService
 */
export class ValidatorService {

  constructor() { }


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






}
