import { Component, Injector, OnInit } from '@angular/core';
import {FormGroup, FormGroupDirective } from '@angular/forms';
import { BaseComponent } from '../base/base.component';
import { FormType } from '../models/form-type';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.css']
})
/**
 * Basic form functionality for all forms.
 *
 * Parent class.
 *
 * Used by: CategoryFormComponent.
 */
export class BaseFormComponent extends BaseComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/



  form: FormGroup = new FormGroup({});
  isSubmitted: boolean = false;

  //will be overwritten by child components
  protected formType: FormType | undefined; //type of form
  protected requestType: any;  // html request
  protected routeAfterSuccess: any;  //route address after successful submission
  protected queryParamsRouteAfterSuccess: any; // parameters for routing after successful submission
  protected routeAfterDiscard: any; // route address after discard form
  protected queryParamsAfterDiscard: any; //parameters for routing after discard


  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    public formService: FormService, //child form to pass in correct form service
    public injector: Injector
              ) {
    super(injector);
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  //left empty, to be overwritten by child
  ngOnInit(): void {
    super.ngOnInit();
    this.initializeForm();
  }


  /*******************************************************************************************************************
   * FORM HANDLERS
   ******************************************************************************************************************/

  /**
   * Builds form.
   *
   * @param preSets: if applicable any data to pre-populate form.
   */
  initializeForm(preSets?: any): void{
    this.form = this.formService.buildForm(preSets); //specific FormService will create the correct form
  }

  /**
   * Submits form to backend and handles re-routing in case of success/error.
   * @param formDirective
   */
  onSubmit(formDirective: FormGroupDirective): void {
    this.formService.sendForm(this.form, this.requestType).subscribe(
      (res: any) => {
        this.isSubmitted = false;
        this.reRouteAfterSuccess(this.routeAfterSuccess, this.queryParamsRouteAfterSuccess);
      },
      (error: any) =>{
        console.log(error);
        this.isSubmitted = false;
      });
  }

  /*******************************************************************************************************************
   * USER FLOW
   ******************************************************************************************************************/

  /**
   * Reroutes after successful submission of form.
   *
   * @param route: route address
   * @param queryParams: if applicable, query parames for routing
   */
  reRouteAfterSuccess(route: string, queryParams?: any): void {
    if(queryParams){
      this.router.navigate([route], {queryParams: queryParams}).then((r:any) =>{});
    }
    else{
      this.router.navigate([route]).then((r:any) =>{});
    }
  }

  /**
   * Reroutes if form is discarded.
   */
  discardChanges(): void {
    this.isSubmitted = false;
    if(this.queryParamsAfterDiscard){
      this.router.navigate([this.routeAfterDiscard], {queryParams: this.queryParamsAfterDiscard}).then((r:any) =>{});
    }
    else{
      this.router.navigate([this.routeAfterDiscard]).then((r:any) =>{});
    }
  }


}
