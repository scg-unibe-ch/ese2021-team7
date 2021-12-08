import { DataSource } from '@angular/cdk/collections';
import {ChangeDetectorRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { Category } from '../models/category';
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
export class CategoryListComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  // DataSource for table contents
  categoriesData: CategoriesDataSourceService = new CategoriesDataSourceService(this.categoryService);

  // displayed columns
  displayedColumns = ["id", "name", "typeName"];

  // User
  loggedIn = false;
  currentUser : User = new User(0, '', '', false,'','','','','','','','','');

  /*******************************************************************************************************************
   * CONTRUCTOR
   ******************************************************************************************************************/

  constructor(private categoryService: CategoryService,
              private categoriesDataSource: CategoriesDataSourceService,
              private dialog: MatDialog,
              private router: Router,
              private permissionService: PermissionService,
              private userService: UserService) { }

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

    if(!this.permissionService.checkPermissionsToAccessCategoryList(this.loggedIn, this.currentUser)){
      this.router.navigate(['/home']).then(r => {});
    }

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
