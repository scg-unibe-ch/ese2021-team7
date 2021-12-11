import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../base-form/base-form.component';
import { AccessPermission } from '../models/access-permission';
import { FormType } from '../models/form-type';
import { PermissionType } from '../models/permission-type';
import { User } from '../models/user.model';
import { CategoryFormService } from '../services/category-form.service';
import { PermissionService } from '../services/permission.service';
import { UserService } from '../services/user.service';

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

  // overrides Base component
  permissionToAccess = PermissionType.AccessCategoryForm;

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/
  constructor(
              public categoryFormService: CategoryFormService, // pass the correct form service
              private dialogRef: MatDialogRef<CategoryFormComponent>,
              public injector: Injector
              ) {
    super(categoryFormService, injector);
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/
  ngOnInit(): void {
    super.ngOnInit();
    //super.initializeUser();
    //super.initializeForm(); // implemented in parent class
    //super.evaluateAccessPermissions();
  }

  /*******************************************************************************************************************
   * USER FLOW
   ******************************************************************************************************************/
  //override Form
  reRouteAfterSuccess(route: string, queryParams?: any): void {
    this.dialogRef.close();
  }

  //override Base Component
  protected reRouteIfNoAccess(route: string, queryParams?: any): void {
    this.dialogRef.close();
  }

  discard(): void {
    this.dialogRef.close(); //closes dialog box
  }


}
