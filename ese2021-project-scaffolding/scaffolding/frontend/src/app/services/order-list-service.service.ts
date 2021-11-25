import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Order} from "../models/order.model";
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderListServiceService {

  private orderList: Order[];

  constructor(public httpClient: HttpClient) {
    this.orderList = [];
  }


  getAllOrders(): Observable<Order[]> {
    return this.httpClient.get(environment.endpointURL + "order/all").pipe(map(res => res["order"]));
  }


}
