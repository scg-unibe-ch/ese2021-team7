import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Product } from '../models/product.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(public httpClient: HttpClient) { }


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
