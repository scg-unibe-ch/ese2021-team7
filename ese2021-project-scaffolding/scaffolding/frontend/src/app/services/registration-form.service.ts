import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { FormService } from './form.service';
import { ValidatorService } from './validator.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationFormService implements FormService {

  constructor(private fb: FormBuilder,
              private httpClient: HttpClient,
              private validatorService: ValidatorService) { }


  /*******************************************************************************************************************
   * FORM BUILDER
   ******************************************************************************************************************/

  /**
   * Overrrides parents method.
   *
   * Creates form controls for registration form.
   *
   * @param preSets: none
   */
  buildForm(preSets?: any): FormGroup{
    console.log("Presets: " + JSON.stringify(preSets));
    return this.fb.group({
      userName: new FormControl('', Validators.compose([Validators.required]), [this.validatorService.userNameInUseValidator()]),
      password: new FormControl(null, Validators.compose([Validators.required,
        this.validatorService.patternValidator(/(?=.*[0-9])[0-9]{1,}/, {'noNumberInPassword': true}),
        this.validatorService.patternValidator(/(?=.*[a-z])[a-z]{1,}/, {'noSmallLetter': true}),
        this.validatorService.patternValidator(/(?=.*[A-Z])[A-Z]{1,}/, {'noCapitalLetter': true}),
        this.validatorService.patternValidator(/(?=.*[@#$%^&-+=()])[@#$%^&-+=()]{1,}/, {'noSpecialCharacter': true}),
        Validators.minLength(8)])),
      email: new FormControl('', Validators.email, [this.validatorService.emailInUseValidator()]),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      street: new FormControl(''),
      houseNumber: new FormControl('', Validators.compose([
        this.validatorService.patternValidator(/^[0-9]*$/, {'notValidHouseNr': true})])), //only numbers
      zipCode: new FormControl('', Validators.compose([
        this.validatorService.patternValidator(/^\d{4}$/, {'notValidZipCode': true})])), //excactly 4 digits
      city: new FormControl(''),
      birthday: new FormControl(''),
      phoneNumber: new FormControl('', Validators.compose([
        this.validatorService.patternValidator(/^[\+]?[0-9]{11}$/, {'notValidPhoneNr': true})])) // of form +41795554433
    });
  }

  /*******************************************************************************************************************
   * BACKEND HANDLER
   ******************************************************************************************************************/

  /**
   * Overrides parents method.
   *
   * Sends registration request to backend.
   **
   * @param form: registration form
   * @param requestType: user/register
   */
  sendForm(form: FormGroup, requestType: any): Observable<any>{
    return this.httpClient.post(environment.endpointURL + requestType, {
      userName: form.value.userName,
      password: form.value.password,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      street: form.value.street,
      houseNumber: form.value.houseNumber,
      zipCode: form.value.zipCode,
      city: form.value.city,
      phoneNumber: form.value.phoneNumber,
      birthday: form.value.birthday
    });
  }


}
