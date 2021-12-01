import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Order} from "../models/order.model";
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { of } from 'rxjs';
import {catchError, concatAll, concatMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ProductService } from './product.service';
import { OrderToDisplay } from '../models/order-to-display';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderListServiceService {

  constructor(public httpClient: HttpClient, public productService: ProductService) {}


  /**
   * Gets all orders.
   *
   * return: Observable<OrderToDisplay[]>
   */
  getAllOrders(): Observable<any[]> {
    return this.httpClient.get(environment.endpointURL + "order/all")
      .pipe(
        tap((tapOrders: any) => console.log("Tab dbOrders: " + JSON.stringify(tapOrders))),
        mergeMap((dbOrders:any[]) => {
          let forkJoinArray: any[] = [];
          dbOrders.forEach(
            (order: any) => forkJoinArray.push(this.httpClient.get(environment.endpointURL + "product/byId", {
              params: {
                productId: order.ProductProductId
              }
            }).pipe(
              tap((tapProduct: any) => console.log(JSON.stringify("Tap Product: " + tapProduct))),
              map(
                (product: any) => {
                  let address = order.deliveryAdress.split(' ');
                  while (address.length < 4) {
                    address.push("");
                  }
                  return new OrderToDisplay(
                    order.orderId,
                    order.user,
                    order.ProductProductId,
                    product.title,
                    product.image,
                    product.description,
                    product.price,
                    "not yet connected",
                    "not yet connected",
                    address[0],
                    address[1],
                    address[2],
                    address[3],
                    order.paymentOption,
                    order.orderStatus
                  );
                }
              )
            )))
          return forkJoin(forkJoinArray);
          }
        ),
        tap((res: any) => console.log(JSON.stringify(res)))
        )

  }

  shipOrder(orderId: number): Observable<any> {
      return this.httpClient.post(environment.endpointURL + "order/ship", {
        orderId: orderId
      });
  }



}
