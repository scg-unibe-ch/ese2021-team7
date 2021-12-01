import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    //let categories = this.categoryService.getCategoriesfromBackend();
    //console.log(categories);
    let categoriesSubs = this.categoryService.getAllCategories();
    console.log("object" + JSON.stringify(categoriesSubs));
    let categoiresPorduct = this.categoryService.getProductCategories();
    console.log("object" + JSON.stringify(categoiresPorduct));
    let categoiresPost = this.categoryService.getPostCategories();
    console.log("object" + JSON.stringify(categoiresPost));
  }

}
