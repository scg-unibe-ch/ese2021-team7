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
    //console.log("Presets: " + JSON.stringify(preSets));
    return this.fb.group({
      loginDetails: this.fb.group({
        userName: ['', Validators.compose([Validators.required]), [this.validatorService.userNameInUseValidator()]],
        password: [null, Validators.compose([Validators.required,
          this.validatorService.patternValidator(/(?=.*[0-9])[0-9]{1,}/, {'noNumberInPassword': true}),
          this.validatorService.patternValidator(/(?=.*[a-z])[a-z]{1,}/, {'noSmallLetter': true}),
          this.validatorService.patternValidator(/(?=.*[A-Z])[A-Z]{1,}/, {'noCapitalLetter': true}),
          this.validatorService.patternValidator(/(?=.*[@#$%^&-+=()])[@#$%^&-+=()]{1,}/, {'noSpecialCharacter': true}),
          Validators.minLength(8)])],
        email: ['', Validators.email, [this.validatorService.emailInUseValidator()]],
      }),
      address: this.fb.group({
        firstName: [''],
        lastName: [''],
        street: [''],
        houseNumber: ['', Validators.compose([this.validatorService.patternValidator(/^[0-9]*$/, {'notValidHouseNr': true})])], //only numbers
        zipCode: ['', Validators.compose([this.validatorService.patternValidator(/^\d{4}$/, {'notValidZipCode': true})])], //excactly 4 digits
        city: ['']
      }),
      personalDetails: this.fb.group({
        birthday: [''],
        phoneNumber: ['', Validators.compose([
          this.validatorService.patternValidator(/^[\+]?[0-9]{11}$/, {'notValidPhoneNr': true})])] // of form +41795554433
      })
      /*formArray: this.fb.array([
        this.fb.group({
          userName: ['', Validators.compose([Validators.required]), [this.validatorService.userNameInUseValidator()]],
          password: [null, Validators.compose([Validators.required,
          this.validatorService.patternValidator(/(?=.*[0-9])[0-9]{1,}/, {'noNumberInPassword': true}),
          this.validatorService.patternValidator(/(?=.*[a-z])[a-z]{1,}/, {'noSmallLetter': true}),
          this.validatorService.patternValidator(/(?=.*[A-Z])[A-Z]{1,}/, {'noCapitalLetter': true}),
          this.validatorService.patternValidator(/(?=.*[@#$%^&-+=()])[@#$%^&-+=()]{1,}/, {'noSpecialCharacter': true}),
          Validators.minLength(8)])],
          email: ['', Validators.email, [this.validatorService.emailInUseValidator()]],
          firstName : [''],
          lastName : [''],
          street : [''],
          houseNumber: ['', Validators.compose([this.validatorService.patternValidator(/^[0-9]*$/, {'notValidHouseNr': true})])], //only numbers
          zipCode: ['', Validators.compose([this.validatorService.patternValidator(/^\d{4}$/, {'notValidZipCode': true})])], //excactly 4 digits
          city: [''],
          birthday: [''],
          phoneNumber: ['', Validators.compose([
          this.validatorService.patternValidator(/^[\+]?[0-9]{11}$/, {'notValidPhoneNr': true})])] // of form +41795554433
      })
    ])*/
  });

/*      userName: new FormControl('', Validators.compose([Validators.required]), [this.validatorService.userNameInUseValidator()]),
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
        this.validatorService.patternValidator(/^[\+]?[0-9]{11}$/, {'notValidPhoneNr': true})])) // of form +41795554433*/

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
      userName: form.value.loginDetails.userName,
      password: form.value.loginDetails.password,
      firstName: form.value.address.firstName,
      lastName: form.value.address.lastName,
      email: form.value.loginDetails.email,
      street: form.value.address.street,
      houseNumber: form.value.address.houseNumber,
      zipCode: form.value.address.zipCode,
      city: form.value.address.city,
      phoneNumber: form.value.personalDetails.phoneNumber,
      birthday: form.value.personalDetails.birthday
    });
  }


}
