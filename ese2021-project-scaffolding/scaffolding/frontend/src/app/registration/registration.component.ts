import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import {FormControl, FormGroup, FormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl, FormGroupDirective} from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  userNameAlreadyInUse: boolean;

  registrationForm = this.fb.group({
    userName: new FormControl('', Validators.compose([Validators.required])),
    password: new FormControl(null, Validators.compose([Validators.required,
      this.patternValidator(/(?=.*[0-9])[0-9]{1,}/, {'noNumberInPassword': true}),
      this.patternValidator(/(?=.*[a-z])[a-z]{1,}/, {'noSmallLetter': true}),
      this.patternValidator(/(?=.*[A-Z])[A-Z]{1,}/, {'noCapitalLetter': true}),
      this.patternValidator(/(?=.*[@#$%^&-+=()])[@#$%^&-+=()]{1,}/, {'noSpecialCharacter': true}),
      Validators.minLength(8)])),
    email: new FormControl('', Validators.email),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    street: new FormControl(''),
    houseNumber: new FormControl(''),
    zipCode: new FormControl(''),
    city: new FormControl(''),
    birthday: new FormControl(''),
    phoneNumber: new FormControl('')
  });

  constructor(public httpClient: HttpClient, private fb: FormBuilder) {
    this.userNameAlreadyInUse = false;
  }

  onSubmit(formDirective: FormGroupDirective): void {
    console.log(this.registrationForm);
    console.log(this.registrationForm.valid);
    if(this.registrationForm.valid) {
      this.httpClient.post(environment.endpointURL + "user/register", {
        userName: this.registrationForm.value.userName,
        password: this.registrationForm.value.password,
        firstName: this.registrationForm.value.firstName,
        lastName: this.registrationForm.value.lastName,
        email: this.registrationForm.value.email,
        street: this.registrationForm.value.street,
        houseNumber: this.registrationForm.value.houseNumber,
        zipCode: this.registrationForm.value.zipCode,
        city: this.registrationForm.value.city,
        phoneNumber: this.registrationForm.value.phoneNumber,
        birthday: this.registrationForm.value.birthday
      }).subscribe((res: any) => {
        console.log(res);
        this.userNameAlreadyInUse = false;
        this.registrationForm.reset();
        formDirective.resetForm();
      },
        (error: any) =>{
        console.log(error);
        if(error.error.message == 10){
          console.log("Username already in use");
          this.userNameAlreadyInUse = true;
          console.log(this.userNameAlreadyInUse);
        }
        });
    }
  }



  patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
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

  //currently not set
  userNameValidator(control: FormControl): {[s: string]: boolean}{
    if(this.userNameAlreadyInUse){
      return {'userNameAlreadyInUse': true};
    }
    return null;
  }

  isUserNameValid(): boolean {
    return !this.userNameAlreadyInUse;
  }

}


