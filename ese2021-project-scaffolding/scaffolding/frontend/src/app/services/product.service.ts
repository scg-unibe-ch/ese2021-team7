import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Order} from "../models/order.model";
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(public httpClient: HttpClient) { }


  public getProductById(productId: number): Observable<any> {
    console.log("product service fired");
    return this.httpClient.get(environment.endpointURL + "product/byId", {
      params: {
        productId: productId
      }
    });
  }
}
