import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';


/**
 * Gets categories from backend.
 *
 * Categories cannot be added, changed, or deleted.
 *
 * There are post categories and product categories.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  //Category types: post, product
  private postType = 0;
  private productType = 1;

  // Categories array
  private categories: Category[] = [];
  private productCategories: Category[] = [];
  private postCategories: Category[] = [];

  /*******************************************************************************************************************
   * OBSERVABLE SOURCES & STREAMS
   ******************************************************************************************************************/

  // Observable Sources
  private categoriesSource = new BehaviorSubject<Category[]>([]);
  private productCategoriesSource = new BehaviorSubject<Category[]>([]);
  private postCategoriesSource = new BehaviorSubject<Category[]>([]);


  // Stream
  categories$ = this.categoriesSource.asObservable();
  productCategories$ = this.productCategoriesSource.asObservable();
  postCategories$ = this.postCategoriesSource.asObservable();


  /*******************************************************************************************************************
   * Constructor
   ******************************************************************************************************************/
  constructor(private httpClient: HttpClient) {
    this.getCategoriesFromBackend();
  }

  /*******************************************************************************************************************
   * GET Requests
   ******************************************************************************************************************/
  /**
   * Returns all categories.
   *
   * * @return: Category[]
   */
  getAllCategories(): Category[] {
    //console.log("All Categories: " + this.categories);
    return this.categories;
  }

  /**
   * Returns Product categories only.
   *
   * @return: Category[]
   */
  getProductCategories(): Category[] {
    //console.log("Product Categories: " + this.categories);
    return this.productCategories;
  }

  /**
   * Returns post categories only.
   *
   * @return: Category[]
   */
  getPostCategories(): Category[] {
    //console.log("Post Categories: " + this.categories);
    return this.postCategories;
  }


  /**
   * Returns specific category for given category id.
   *
   * @param id
   */
  getCategoryById(id: number): Category {
    let returnCategory: Category = new Category(0, "undefined", 0);
    //this.getCategoriesFromBackend(); //update categories from backend
    //console.log("Selection Id array: " + this.categories);
    this.categories.forEach(
      (category: Category) => {
        //console.log("filter category:" + JSON.stringify(category));
        if(category.id == id){
          returnCategory = category;
        }
      }
      );
    //console.log("Category filtered: " + returnCategory);
    return returnCategory;
  }

  getDataSource(): BehaviorSubject<Category[]> {
    return this.categoriesSource;
  }
  /*******************************************************************************************************************
   * HTTP Request Handler
   ******************************************************************************************************************/

  /**
   * Gets categories from backend and updates the Categories field.
   */
  private getCategoriesFromBackend(): void {
    this.categories = []; //delete exiting values
    this.httpClient.get(environment.endpointURL + "category/all").pipe(
      map(
        (data:any) =>
          data.map(
            (category: any) => this.createCategoryFromBackendResponse(category) //return array of Category[]
          )),
      //tap((data:any) => console.log("Categories received from backend: "+ JSON.stringify(data)))
    ).subscribe((data:any) => {
      this.categoriesSource.next(data);
      this.categories = data;
      this.productCategories = data.filter((category: Category) => category.type == this.productType); //filter for product categories
      this.postCategories = data.filter((category: Category) => category.type == this.postType); // filter for post categories
      //console.log("Post Categories: " + JSON.stringify(this.postCategories));
      //console.log("Product Categories: " + JSON.stringify(this.productCategories));
      //console.log("All Categories: " + JSON.stringify(this.categories));
    });
  }


  getCategoriesFromBackendAsObservable(): Observable<Category[]>{
    return this.httpClient.get(environment.endpointURL + "category/all").pipe(
      map(
        (data:any) =>
          data.map(
            (category: any) => this.createCategoryFromBackendResponse(category) //return array of Category[]
          )),
      //tap((data:any) => console.log("Categories received from backend: "+ JSON.stringify(data)))
    );
  }


  /*******************************************************************************************************************
   * Helper Methods
   ******************************************************************************************************************/

  refresh(): void{
    this.getCategoriesFromBackend();
  }


  /**
   * Takes backend response and returns Category object.
   * @param backendRes
   * @return Category
   * @private
   */
  private createCategoryFromBackendResponse(backendRes: any): Category {
    return new Category(
      backendRes.categoryId,
      backendRes.name,
      backendRes.type
    );
  }

}
