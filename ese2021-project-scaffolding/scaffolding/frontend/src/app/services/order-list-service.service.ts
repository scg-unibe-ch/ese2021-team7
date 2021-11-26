import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Order} from "../models/order.model";
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderListServiceService {

  private orderList: Order[];

  constructor(public httpClient: HttpClient) {
    this.orderList = [];
  }


  /**
   * Gets all orders.
   *
   * return: Observable<Order[]>
   */
  /*
  getAllOrders(): Observable<Order[]> {
    this.httpClient.get(environment.endpointURL + "order/all").subscribe((res: any) => {
      console.log(res);
      res.forEach((order: any) => {
        let address = order.deliveryAdress.split(' ');
        while (address.length<4){
          address.push("");
        }
        this.orderList.push(
          new Order(
            order.orderId,
            0,
            order.user, // userId of the user which places the order
            order.ProductProductId, // to indicate which product is sold
            order.firstName,
            order.lastName,
            address[0],
            address[1],
            address[2],
            address[3],
            order.paymentOption,
            order.orderStatus
          ));
      })
    }, (error: any) => {
      console.log(error);
    });
    console.log(this.orderList);
    return of(this.orderList); //returns Observable of orderList

  }
*/


  /**
   * Gets all orders.
   *
   * return: Observable<Order[]>
   */
  getAllOrders(): Observable<Order[]> {
    return this.httpClient.get(environment.endpointURL + "order/all")
      .pipe(
      map((dbOrders:any) => dbOrders.map(
        (dbOrder: any) => {
          let address = dbOrder.deliveryAdress.split(' ');
          while (address.length<4){
            address.push("");
          }
            return new Order(
              dbOrder.orderId,
              0,
              dbOrder.user, // userId of the user which places the order
              dbOrder.ProductProductId, // to indicate which product is sold
              dbOrder.firstName,
              dbOrder.lastName,
              address[0],
              address[1],
              address[2],
              address[3],
              dbOrder.paymentOption,
              dbOrder.orderStatus
            );
          })))

  }





}
