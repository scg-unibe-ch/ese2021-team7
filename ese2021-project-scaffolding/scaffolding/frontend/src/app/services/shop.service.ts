import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product.model';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Backend handler for ProductList.
 *
 * Used in: ProductList
 */
export class ShopService {

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
              private httpClient: HttpClient,
              private categoryService: CategoryService) {
    this.getProductsFromBackend(); // get products
  }

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  // Products array
  private products: any[] = [];

  /*******************************************************************************************************************
   * OBSERVABLE SOURCES & STREAMS
   ******************************************************************************************************************/

    // Observable Sources
  private productsSource = new BehaviorSubject<Product[]>([]);

  // Stream
  products$ = this.productsSource.asObservable();

  /*******************************************************************************************************************
   * GETTERS
   ******************************************************************************************************************/
  /**
   * Returns all products.
   *
   * * @return: Product[]
   */
  getAllProducts(): Product[] {
    console.log("All Products: " + this.products);
    return this.products;
  }

  /*******************************************************************************************************************
   * BACKEND HANDLERS
   ******************************************************************************************************************/

  /**
   * Gets all categories from backend and updates different categories variables.
   */
  private getProductsFromBackend(): void {
    this.products = []; //delete exiting values
    this.httpClient.get(environment.endpointURL + "product/all").pipe(
      map(
        (data:any) =>
          data.map(
            (product: any) => this.createProductFromBackendResponse(product) //return array of Category[]
          ))
    ).subscribe((data:any) => {
      this.productsSource.next(data);
      console.log("Data to be saved: "+ JSON.stringify(data));
      this.products = data;
      console.log("Data saved: " + JSON.stringify(this.products));
    });
  }

  /**
   * Gets all products from backend and returns it as an observable.
   * Used in ShopDataSourceService.
   */
  getProductsFromBackendAsObservable(): Observable<Product[]>{
    return this.httpClient.get(environment.endpointURL + "product/all").pipe(
      map(
        (data:any) =>
          data.map(
            (product: any) => this.createProductFromBackendResponse(product) //return array of Category[]
          )),
    );
  }

  /**
   * Gets specific product from backend. Returns Observable.
   * @param productId: you want from backend.
   */
  getProductByIdAsObservable(productId: number): Observable<Product> {
    return this.httpClient.get(environment.endpointURL + "product/byId", {
      params: {
        productId: productId
      }
    }).pipe(
      map(product => this.createProductFromBackendResponse(product))
    );
  }

  /*******************************************************************************************************************
   * EVENTS
   ******************************************************************************************************************/

  /**
   * Refreshes data with all products.
   */
  refresh(): void{
    this.getProductsFromBackend();
  }

  /**
   * Filters shop for given product category.
   *
   * @param categoryId: category to filter
   */
  filterShop(categoryId:number): void {
    this.getProductsFromBackendAsObservable().pipe(
      map((products: any) =>
        products.filter((product: Product) => product.category.id == categoryId) //checks if category id matches
      )
    ).subscribe(
      (products: Product[]) => this.productsSource.next(products)
    );
  }

  /**
   * Delets product.
   *
   * @param product to be deletec.
   */
  deleteProduct(product: Product): void {
    this.httpClient.post(environment.endpointURL + "product/delete", {
      productId: product.productId
    }).subscribe(() => {
      this.refresh();
    });
  }

  /*******************************************************************************************************************
   * Helper Methods
   ******************************************************************************************************************/

  /**
   * Takes backend response and returns Product object.
   * @param backendRes: response from backend
   * @return Product
   * @private
   */
  createProductFromBackendResponse(product: any): Product{
   return new Product(
     product.productId,
     product.title,
     product.description,
     product.image,
     product.price,
     this.categoryService.getCategoryById(product.productCategory),
     !product.isAvailable);
  }


}
