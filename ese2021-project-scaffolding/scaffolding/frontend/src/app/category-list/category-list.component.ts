import { DataSource } from '@angular/cdk/collections';
import {ChangeDetectorRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { Category } from '../models/category';
import { CategoriesDataSourceService } from '../services/categories-data-source.service';
import { CategoryService } from '../services/category.service';

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

  /*******************************************************************************************************************
   * CONTRUCTOR
   ******************************************************************************************************************/

  constructor(private categoryService: CategoryService,
              private categoriesDataSource: CategoriesDataSourceService,
              private dialog: MatDialog) { }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit(): void {
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
