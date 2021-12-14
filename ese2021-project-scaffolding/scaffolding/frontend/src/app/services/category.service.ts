import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';
import { CategoryType } from '../models/category-type';


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

  // Categories array
  public categories: Category[] = [];
  private productCategories: Category[] = [];
  private postCategories: Category[] = [];

  private categoriesLoading: boolean = false;

  /*******************************************************************************************************************
   * OBSERVABLE SOURCES & STREAMS
   ******************************************************************************************************************/

  // Observable Sources
  private categoriesSource = new BehaviorSubject<Category[]>([]);
  private productCategoriesSource = new BehaviorSubject<Category[]>([]);
  private postCategoriesSource = new BehaviorSubject<Category[]>([]);
  private cateogiresLoadingSource = new BehaviorSubject<boolean>(false);


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
   * GETTERS
   ******************************************************************************************************************/
  /**
   * Returns all categories.
   *
   * * @return: Category[]
   */
  getAllCategories(): Category[] {
    return this.categories;
  }

  /**
   * Returns Product categories only.
   *
   * @return: Category[]
   */
  getProductCategories(): Category[] {
    return this.productCategories;
  }

  /**
   * Returns post categories only.
   *
   * @return: Category[]
   */
  getPostCategories(): Category[] {
    return this.postCategories;
  }


  /**
   * Returns specific category for given category id.
   *
   * @param id
   */
  getCategoryById(id: number): Category {
    let returnCategory: Category = new Category(0, "undefined", 0, "undefined");
    this.categories.forEach(
      (category: Category) => {
        if(category.id == id){
          returnCategory = category;
        }
      }
      );
    return returnCategory;
  }

  /*******************************************************************************************************************
   * BACKEND HANDLERS
   ******************************************************************************************************************/

  /**
   * Gets all categories from backend and updates different categories variables.
   */
  private getCategoriesFromBackend(): void {
    this.cateogiresLoadingSource.next(true);
    this.categories = []; //delete exiting values
    this.httpClient.get(environment.endpointURL + "category/all").pipe(
      map(
        (data:any) =>
          data.map(
            (category: any) => this.createCategoryFromBackendResponse(category) //return array of Category[]
          ))
    ).subscribe((data:any) => {
      this.categoriesSource.next(data);
      this.categories = data;
      this.productCategories = data.filter((category: Category) => category.type == CategoryType.Product); //filter for product categories
      this.postCategories = data.filter((category: Category) => category.type == CategoryType.Post); // filter for post categories
      this.productCategoriesSource.next(this.productCategories);
      this.postCategoriesSource.next(this.postCategories);
    });
  }

  /**
   * Gets all categories from backend and returns it as an observable.
   * Used in CategoriesDataService.
   */
  getCategoriesFromBackendAsObservable(): Observable<Category[]>{
    return this.httpClient.get(environment.endpointURL + "category/all").pipe(
      map(
        (data:any) =>
          data.map(
            (category: any) => this.createCategoryFromBackendResponse(category) //return array of Category[]
          ))
    );
  }

  getPostCategoriesFromBackendAsObservable(): Observable<Category[]> {
    return this.getCategoriesFromBackendAsObservable().pipe(
      map((categories: Category []) => categories.filter((category: Category) => category.type == CategoryType.Post))
    );
  }

  getProductCategoriesFromBackendAsObservable(): Observable<Category[]> {
    return this.getCategoriesFromBackendAsObservable().pipe(
      map((categories: Category []) => categories.filter((category: Category) => category.type == CategoryType.Product))
    );
  }

  /**
   * Refreshes data.
   */
  refresh(): void{
    this.getCategoriesFromBackend();
  }

  /*******************************************************************************************************************
   * Helper Methods
   ******************************************************************************************************************/


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
      backendRes.type == 0? CategoryType.Post : CategoryType.Product,
      backendRes.type == 0? CategoryType[CategoryType.Post] : CategoryType[CategoryType.Product]
    );
  }

}
