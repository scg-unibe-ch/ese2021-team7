import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Order} from "../models/order.model";
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderListServiceService {

  private orderList: Order[];

  constructor(public httpClient: HttpClient) {
    this.orderList = [];
  }


  getAllOrders(): Observable<Order[]> {
    this.httpClient.get(environment.endpointURL + "order/all").subscribe((res: any) => {
      console.log(res);
      res.forEach((order: any) => {
        let array = order.deliveryAdress.split(' ');
        while (array.length<4){
          array.push("");
        }
        this.orderList.push(
          new Order(
            order.orderId,
            0, // to indicate that it belongs to a certain oder list
            order.user, // userId of the user which places the order
            order.ProductProductId, // to indicate which product is sold
            order.firstName,
            order.lastName,
            array[0],
            array[1],
            array[2],
            array[3],
            order.paymentOption,
            order.orderStatus));
      })
    }, (error: any) => {
      console.log(error);
    });
    console.log(this.orderList);
    return of(this.orderList);

  }



  /*

  getAllOrders() {
    return this.httpClient.get(environment.endpointURL + "order/all");

  }

   */



}
