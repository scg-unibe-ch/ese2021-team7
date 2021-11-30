import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Category } from '../category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: Category[] = [];

  constructor(private httpClient: HttpClient) { }

  /**
   * Gets all category from backend.
   *
   * Returns array with Category objects.
   */
  getAllCategories(): Category[] {
    this.httpClient.get(environment.endpointURL + "category/all")
      .subscribe(
        (data:any) => {
         // console.log(JSON.stringify(data));
          this.categories = data;
         // console.log(this.categories);
          },
        (error:any) => console.log(JSON.stringify(error))
      );
    return this.categories
  }



}
