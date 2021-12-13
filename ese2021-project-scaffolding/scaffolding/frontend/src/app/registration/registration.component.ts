import { Component, Injector, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import {FormControl, FormGroup, FormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl, FormGroupDirective} from '@angular/forms';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';
import { RegistrationFormService } from '../services/registration-form.service';
import { BaseFormComponent } from '../base-form/base-form.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent extends BaseFormComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  // Overrides
  requestType: string = "user/register";
  routeAfterSuccess =  "/login";  //route address after successful submission
  queryParamsRouteAfterSuccess =  {registered : 'true'}; // parameters for routing after successful submission

  // Loading flag
  isLoading: boolean = false;

  isOptional: boolean = true;


  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    public injector: Injector,
    public registrationFormService: RegistrationFormService
  ) {
    super(registrationFormService, injector);
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit(): void {
    super.ngOnInit();
    super.initializeForm();
  }


  get formArray(): AbstractControl | null { return this.form.get('formArray'); }

}


