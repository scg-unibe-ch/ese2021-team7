import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(public httpClient: HttpClient) { }

  /**
   * Get product information from the database
   *
   * @param productId: product where the information is requested
   */
  public getProductById(productId: number): Observable<any> {
    return this.httpClient.get(environment.endpointURL + "product/byId", {
      params: {
        productId: productId
      }
    }).pipe(
      tap((product: any) => console.log("Tap of product service: "+ JSON.stringify(product)))
    );
  }
}
