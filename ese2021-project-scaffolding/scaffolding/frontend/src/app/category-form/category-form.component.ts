import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../base-form/base-form.component';
import { FormType } from '../models/form-type';
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

  // User
  loggedIn = false;
  currentUser : User = new User(0, '', '', false,'','','','','','','','','');

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/
  constructor(public fb: FormBuilder,
              public categoryFormService: CategoryFormService, // pass the correct form service
              public router: Router,
              public route: ActivatedRoute,
              private dialogRef: MatDialogRef<CategoryFormComponent>,
              private permissionsService: PermissionService,
              private userService: UserService) {
    super(fb, categoryFormService, router, route);
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/
  ngOnInit(): void {
    // Listen for changes
    this.userService.loggedIn$.subscribe(res => this.loggedIn = res);
    this.userService.user$.subscribe(res => this.currentUser = res);
    //get current values
    this.loggedIn = this.userService.getLoggedIn();
    this.currentUser = this.userService.getUser();


    this.initializeForm(); // implemented in parent class
    if(!this.permissionsService.checkPermissionsToAccessCategoryForm(this.loggedIn, this.currentUser)){
      if(this.dialogRef){
        this.router.navigate(['/home']).then(r => {});
        this.dialogRef.close();
      }

    }
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
