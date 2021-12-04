import {CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

  constructor(private categoryService: CategoryService,
              private categoriesDataSource: CategoriesDataSourceService) { }

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

}
