import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import {ActivatedRoute, Router } from '@angular/router';
import { Category } from '../models/category';
import { FormType } from '../models/form-type';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.css']
})
export class BaseFormComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  isSubmitted: boolean = false;
  protected formType: FormType | undefined;
  protected requestType: any;
  protected routeAfterSuccess: any;
  protected queryParamsRouteAfterSuccess: any;
  protected routeAfterDiscard: any;
  protected queryParamsAfterDiscard: any;

  constructor(public fb: FormBuilder,
              public formService: FormService,
              public router: Router,
              public route: ActivatedRoute,
              ) {}

  ngOnInit(): void {
  }

  initializeForm(formType: FormType, preSets?: any): void{
    this.form = this.formService.formBuilderFactory(formType, preSets);
  }

  onSubmit(formDirective: FormGroupDirective): void {
    this.formService.sendForm(this.form, this.formType, this.requestType).subscribe(
      (res: any) => {
        this.isSubmitted = false;
        this.reRouteAfterSuccess(this.routeAfterSuccess, this.queryParamsRouteAfterSuccess);
      },
      (error: any) =>{
        console.log(error);
        this.isSubmitted = false;
      });
  }

  reRouteAfterSuccess(route: string, queryParams?: any): void {
    if(queryParams){
      this.router.navigate([route], {queryParams: queryParams}).then((r:any) =>{});
    }
    else{
      this.router.navigate([route]).then((r:any) =>{});
    }
  }

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
