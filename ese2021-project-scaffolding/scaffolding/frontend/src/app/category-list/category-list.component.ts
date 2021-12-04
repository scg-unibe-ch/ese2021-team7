import { DataSource } from '@angular/cdk/collections';
import {  ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
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
export class CategoryListComponent implements OnInit {

  categoriesData: CategoriesDataSourceService | undefined;


  displayedColumns = ["id", "name", "typeName"];

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private categoryService: CategoryService,
              private categoriesDataSource: CategoriesDataSourceService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    //let categories = this.categoryService.getCategoriesfromBackend();
    //console.log(categories);
    let categoriesSubs = this.categoryService.getAllCategories();
    console.log("object" + JSON.stringify(categoriesSubs));
    let categoiresPorduct = this.categoryService.getProductCategories();
    console.log("object" + JSON.stringify(categoiresPorduct));
    let categoiresPost = this.categoryService.getPostCategories();
    console.log("object" + JSON.stringify(categoiresPost));
    this.categoriesData = new CategoriesDataSourceService(this.categoryService);
    //this.categoriesData.refreshData();
  }

  openForm(): void{
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '450px'
    });
    dialogRef.afterClosed().subscribe(
      (res:any) => {
        this.categoriesData.refreshData();
        this.table.renderRows();
      }
    )
  }

}
