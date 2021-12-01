import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  productType = 1;
  postType = 0;

  categories: Category[] = [];

  constructor(private httpClient: HttpClient) {
    this.updateCategories();
  }


  // GET METHODS
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
    return this.categories.filter((category: Category) => category.type == this.productType);
  }

  /**
   * Returns post categories only.
   *
   * @return: Category[]
   */
  getPostCategories(): Category[] {
    return this.categories.filter((category: Category) => category.type == this.postType);
  }

  getCategoryById(id: number): Category {
    let returnCategory: Category;
    this.categories.forEach(
      (category: Category) => {
        if(category.id == id){
          returnCategory = category;
        }
      }
      );
    return returnCategory;
}




// HELPER METHODS

  /**
   * Updates Categories array
   * @private
   */
  private updateCategories(): void{
    this.getCategoriesfromBackend();
  }


  /**
   * Gets categories from backend and updates the Categories field.
   */
  getCategoriesfromBackend(): void {
    this.categories = []; //delete exiting values
    this.httpClient.get(environment.endpointURL + "category/all").pipe(
      map(
        (data:any) =>
          data.map(
            (category: any) => this.createCategoryFromBackendResponse(category) //return array of Category[]
          )),
      tap((res:any) => this.categories=res) //assign to field
    ).subscribe((data:any) => this.categories = data);

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
