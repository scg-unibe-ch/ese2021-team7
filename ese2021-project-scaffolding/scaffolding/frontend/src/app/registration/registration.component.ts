import { Component, Injector, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import {FormControl, FormGroup, FormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl, FormGroupDirective, AsyncValidatorFn} from '@angular/forms';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent extends BaseComponent implements OnInit {

  //loggedIn: boolean | undefined;
  userNameAlreadyInUse: boolean = false;

  registrationForm = this.fb.group({
    userName: new FormControl('', Validators.compose([Validators.required]), [this.userNameInUseValidator()]),
    password: new FormControl(null, Validators.compose([Validators.required,
      this.patternValidator(/(?=.*[0-9])[0-9]{1,}/, {'noNumberInPassword': true}),
      this.patternValidator(/(?=.*[a-z])[a-z]{1,}/, {'noSmallLetter': true}),
      this.patternValidator(/(?=.*[A-Z])[A-Z]{1,}/, {'noCapitalLetter': true}),
      this.patternValidator(/(?=.*[@#$%^&-+=()])[@#$%^&-+=()]{1,}/, {'noSpecialCharacter': true}),
      Validators.minLength(8)])),
    email: new FormControl('', Validators.email, [this.emailInUseValidator()]),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    street: new FormControl(''),
    houseNumber: new FormControl(''),
    zipCode: new FormControl(''),
    city: new FormControl(''),
    birthday: new FormControl(''),
    phoneNumber: new FormControl('')
  });

  constructor(
    public httpClient: HttpClient,
    private fb: FormBuilder,
    public injector: Injector
  ) {
    super(injector);
    //this.userNameAlreadyInUse = false;
    // Listen for changes
    //userService.loggedIn$.subscribe(res => this.loggedIn = res);

    // Current value
    //this.loggedIn = userService.getLoggedIn();
  }

  onInit(): void {
    super.ngOnInit();
  }

  onSubmit(formDirective: FormGroupDirective): void {
    console.log(this.registrationForm);
    console.log(this.registrationForm.valid);
    if (this.registrationForm.valid) {
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
          this.router.navigate(['/login'], {queryParams : {registered : 'true'}});
          this.userNameAlreadyInUse = false;
          this.registrationForm.reset();
          formDirective.resetForm();
        },
        (error: any) => {
          console.log(error);
          if (error.error.message == 10) {
            console.log("Username already in use");
            this.userNameAlreadyInUse = true;
            console.log(this.userNameAlreadyInUse);
          }
        });
    }
  }


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

  //currently not set
  userNameValidator(control: FormControl): { [s: string]: boolean } | null {
    if (this.userNameAlreadyInUse) {
      return {'userNameAlreadyInUse': true};
    }
    return null;
  }

  isUserNameValid(): boolean {
    return !this.userNameAlreadyInUse;
  }

/*
  checkIfEmailInUse(checkEmail: string): Observable<boolean> {
    if (checkEmail) {
      this.httpClient.post(environment.endpointURL + "user/checkUserNameOrEmailInUse", {
        email: checkEmail
      }).subscribe((res: any) => {
        console.log(res);
        return of(true);
      }, error => {
        console.log(error);
        return of(false);
      });
    }
    return of(false);
  }
*/
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

/*
  checkIfUserNameInUse(checkUserName: string): Observable<boolean> {
    if (checkUserName) {
      this.httpClient.post(environment.endpointURL + "user/checkUserNameOrEmailInUse", {
        userName: checkUserName
      }).subscribe((res: any) => {
        console.log(res.inUse);
        return of(res.inUse);
      }, error => {
        console.log(error);
        return of(error);
      });
    }
    return of(false);

  }
*/
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
      /*
            return this.checkIfUserNameInUse(control.value).pipe(
              map((res: boolean) => {
                console.log("result: " + res);
                return res ? {userNameInUse: true} : null;
              })
            );
          };
          */

    }

  }


}


