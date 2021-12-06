import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../base-form/base-form.component';
import { FormType } from '../models/form-type';
import { CategoryFormService } from '../services/category-form.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
/**
 * "Add new category" form.
 *
 * Admin can create new categories. Can choose name and category type.
 *
 * Displayed in Dialog Box in CategoryListComponent.
 *
 * @parent: BaseFormComponent
 */
export class CategoryFormComponent extends BaseFormComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  // overrides parent variables
  protected formType = FormType.Category;
  protected requestType = "category/create";
  protected routeAfterSuccess = "category-list";
  protected routeAfterDiscard = "category-list";

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/
  constructor(public fb: FormBuilder,
              public categoryFormService: CategoryFormService, // pass the correct form service
              public router: Router,
              public route: ActivatedRoute,
              private dialogRef: MatDialogRef<CategoryFormComponent>) {
    super(fb, categoryFormService, router, route);
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/
  ngOnInit(): void {
    this.initializeForm(); // implemented in parent class
  }

  /*******************************************************************************************************************
   * USER FLOW
   ******************************************************************************************************************/
  //override
  reRouteAfterSuccess(route: string, queryParams?: any): void {
    this.dialogRef.close();
  }

  discard(): void {
    this.dialogRef.close(); //closes dialog box
  }


}
