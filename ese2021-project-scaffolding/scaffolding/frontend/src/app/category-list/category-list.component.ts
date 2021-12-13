import { DataSource } from '@angular/cdk/collections';
import {ChangeDetectorRef, Injector, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { BaseComponent } from '../base/base.component';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { AccessPermission } from '../models/access-permission';
import { Category } from '../models/category';
import { PermissionType } from '../models/permission-type';
import { User } from '../models/user.model';
import { CategoriesDataSourceService } from '../services/categories-data-source.service';
import { CategoryService } from '../services/category.service';
import { PermissionService } from '../services/permission.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
/**
 * Displays category list in table for admins.
 *
 * Admin can create new categories.
 */
export class CategoryListComponent extends BaseComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  // DataSource for table contents
  categoriesData: CategoriesDataSourceService = new CategoriesDataSourceService(this.categoryService);

  // displayed columns
  displayedColumns = ["id", "name", "typeName"];

  // overrides
  permissionToAccess = PermissionType.AccessCategoryList;
  routeIfNoAccess: string = "/home";

  /*******************************************************************************************************************
   * CONTRUCTOR
   ******************************************************************************************************************/

  constructor(
              private categoriesDataSource: CategoriesDataSourceService,
              private dialog: MatDialog,
              public injector: Injector
  ) {
    super(injector);
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit(): void {

    //super.initializeUser();
    //super.evaluateAccessPermissions();

    super.ngOnInit();
    super.evaluateAccessPermissions();
    this.categoriesData.refreshData();
  }

  /*******************************************************************************************************************
   * CLICK EVENTS
   ******************************************************************************************************************/

  /**
   * Opens mat-dialog with CategoryFormComponent in it.
   *
   */
  openForm(): void{
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '450px'
    });
    dialogRef.afterClosed().subscribe(
      (res:any) => {
        this.categoriesData.refreshData();
        this.categoryService.refresh();
      }
    )
  }

}
