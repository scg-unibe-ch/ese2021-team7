import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Order} from "../models/order.model";
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


  public getProductById(productId: number): Product {
    console.log("product service fired");
    let product: Product;
    this.httpClient.get(environment.endpointURL + "product/byId", {
      params: {
        productId: productId
      }
    }).pipe(
      tap((product: any) => console.log("Tap of product servcie: "+ JSON.stringify(product)))
    ).subscribe(
      (res: any) => {
        product = new Product(res.productId, res.shopId, res.title, res.description, res.image, res.price, res.category, res.sold);
      }
   );
    return product;
  }
}