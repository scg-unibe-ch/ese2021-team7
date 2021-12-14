import { Injector } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '../base/base.component';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { PermissionType } from '../models/permission-type';
import { CategoriesDataSourceService } from '../services/categories-data-source.service';

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
