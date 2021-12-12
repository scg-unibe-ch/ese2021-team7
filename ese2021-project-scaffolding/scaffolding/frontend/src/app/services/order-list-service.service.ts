import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { of } from 'rxjs';
import {catchError, concatAll, concatMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ProductService } from './product.service';
import { forkJoin } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
/**
 * Handles backend requests for order lists.
 */
export class OrderListServiceService {

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(public httpClient: HttpClient, public productService: ProductService) {}

  /*******************************************************************************************************************
   * BACKEND METHODS
   ******************************************************************************************************************/

  /**
   * Gets all orders from database and returns array with full order information (with products added).
   *
   * Only returns orders for specific user if userId was provided.
   *
   * @param userId optional; returns all orders if not provided, otherwise just order for this specific user.
   * @return Observable<OrderToDisplay[]>
   */
  getAllOrders(userId?: number): Observable<Order[]> {
    return this.httpClient.get(environment.endpointURL + "order/all")
      .pipe(
        tap((tapOrders: any) => console.log("Tab dbOrders: " + JSON.stringify(tapOrders))), //check result coming back
        map((dbOrders: any[]) => dbOrders.filter((order:any) => { //filter data for user, if userId was provided
          if(userId != null){
            return order.user == userId;
          } else {
            return true;
          }
        })),
        tap((tapOrders: any) => console.log("Tab User Filtered data: " + JSON.stringify(tapOrders))),
        mergeMap((dbOrders:any[]) => { //mergeMap to handle inner observables
          let forkJoinArray: any[] = [];
          dbOrders.forEach( //replace each object in array through second call/observable
            (order: any) => forkJoinArray.push(this.httpClient.get(environment.endpointURL + "product/byId", { //get product inorder
              params: {
                productId: order.ProductProductId
              }
            }).pipe(
              tap((tapProduct: any) => console.log(JSON.stringify("Tap Product: " + tapProduct))),
              map(
                (product: any) => {
                  order.orderStatus = this.getStringOfOrderStatus(order.orderStatus); //change orderStatus int for string
                  order.paymentOption = this.getStringOfPaymentMethod(order.paymentOption); // change paymentMethod inf for string
                  return this.createOrderToDisplayFromBackendResponse(order, product);  // join together and give back one OrderToDisplay
                }
              )
            )))
          return forkJoin(forkJoinArray); //forkjoin: give back array of observables
          }
        ),
        tap((res: any) => console.log(JSON.stringify(res)))
        )

  }

  /**
   * Sends order/ship request to backend with provided orderId.
   *
   * @param orderId
   */
  shipOrder(orderId: number): Observable<any> {
      return this.httpClient.post(environment.endpointURL + "order/ship", {
        orderId: orderId
      });
  }

  /**
   * Sends order/cancel order request to backend with provided orderId.
   *
   * @param orderId
   */
  cancelOrder(orderId: number): Observable<any> {
    return this.httpClient.post(environment.endpointURL + "order/cancel", {
      orderId: orderId
    });
  }


  /*******************************************************************************************************************
   * HELPER METHODS
   ******************************************************************************************************************/

  /**
   * Creates an OrderToDisplay object from provided backend data (order and product).
   *
   * @param order
   * @param product
   * @return OrderToDisplay
   */
  createOrderToDisplayFromBackendResponse(order: any, product: any): Order {
    return new Order(
      order.orderId,
      order.user,
      order.ProductProductId,
      product.title,
      product.image,
      product.description,
      product.price,
      order.firstName,
      order.lastName,
      order.street,
      order.houseNr,
      order.zip,
      order.city,
      order.paymentOption,
      order.orderStatus);
  }

  /**
   * Returns the string value for OrderStatus.
   * 0 = pending
   * 1 = shipped
   * 2 = cancelled
   *
   * @param orderStatus: number
   * @return string
   */
  getStringOfOrderStatus(orderStatus: number): string {
    switch(orderStatus){
      case 0:
        return "Pending";
        break;
      case 1:
        return "Shipped";
        break;
      case 2:
        return "Cancelled";
        break;
      default:
        return "Undefined";
        break;
    }
  }

  getStringOfPaymentMethod(paymentMethod: number): string {
    switch(paymentMethod){
      case 1:
        return "Invoice";
        break;
      case 2:
        return "Credit Card";
        break;
      default:
        return "Undefined";
        break;
    }
  }




}
