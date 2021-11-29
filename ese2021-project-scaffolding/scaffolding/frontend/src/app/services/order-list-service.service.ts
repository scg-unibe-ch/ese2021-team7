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

  /*
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
*/

/*
  getAllOrders(): Observable<OrderToDisplay[]> {
    return this.httpClient.get(environment.endpointURL + "order/all")
      .pipe(
        concatMap((dbOrders:any) =>
            dbOrders.map(
              (dbOrder: any) => {
                let orderToDisplay: OrderToDisplay;
                let address = dbOrder.deliveryAdress.split(' ');
                while (address.length < 4) {
                  address.push("");
                }
                this.productService.getProductById(dbOrder.prodcutId).pipe(
                  map((product: any) => {
                     orderToDisplay = new OrderToDisplay(
                      dbOrder.orderId,
                      dbOrder.user,
                      dbOrder.ProductProductId,
                      "Product Title",
                      "Product Image",
                      "Product Description",
                      "price",
                      "first Name",
                      "Las tName",
                      address[0],
                      address[1],
                      address[2],
                      address[3],
                      dbOrder.paymentOption,
                      dbOrder.orderStatus
                     );
                  }
                  )
                );
                return orderToDisplay;
              }
            )


        )
        );
  }
*/
/*

  getAllOrders(): Observable<OrderToDisplay[]> {
    return this.httpClient.get(environment.endpointURL + "order/all")
      .pipe(
        map((dbOrders:any) =>
          dbOrders.map(
            (dbOrder: any) => {
              let address = dbOrder.deliveryAdress.split(' ');
              while (address.length < 4) {
                address.push("");
              }
                 return new OrderToDisplay(
                    dbOrder.orderId,
                    dbOrder.user,
                    dbOrder.ProductProductId,
                    "Product Title",
                    "Product Image",
                    "Product Description",
                    546,
                    "first Name",
                    "Las tName",
                    address[0],
                    address[1],
                    address[2],
                    address[3],
                    dbOrder.paymentOption,
                    dbOrder.orderStatus
                  );
            }
          )
        )
      );
  }
*/



/*
getAllOrders(): Observable<OrderToDisplay[]> {
    return this.httpClient.get(environment.endpointURL + "order/all")
      .pipe(
        tap((tapOrders: any) => console.log("Tab dbOrders: " + JSON.stringify(tapOrders))),
        map((dbOrders:any) =>
          dbOrders.map(
            (dbOrder: any) => {
              this.productService.getProductById(dbOrder.prodcutId).pipe(
                tap((tapProduct: any) => console.log("Tap Product: " + JSON.stringify(tapProduct))),
                map(
                  (product: any) => {
                    let address = dbOrder.deliveryAdress.split(' ');
                    while (address.length < 4) {
                      address.push("");
                    }
                    return new OrderToDisplay(
                      dbOrder.orderId,
                      dbOrder.user,
                      dbOrder.ProductProductId,
                      "Product Title",
                      "Product Image",
                      "Product Description",
                      234,
                      "first Name",
                      "Las tName",
                      address[0],
                      address[1],
                      address[2],
                      address[3],
                      dbOrder.paymentOption,
                      dbOrder.orderStatus
                    );
                  }



              ));

            }
          )
        ),
        tap((tapAfter: any) => console.log("Tap after: "+ JSON.stringify(tapAfter)))
      );
  }*/



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
                    "first Name",
                    "Las tName",
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
        //forkJoin(),
        tap((res: any) => console.log(JSON.stringify(res)))
        )

}



/*
dbOrders.map(
  (dbOrder: any) => {
    console.log(dbOrder.ProductProductId);
    let address = dbOrder.deliveryAdress.split(' ');
    while (address.length < 4) {
      address.push("");
    }
    this.httpClient.get(environment.endpointURL + "product/byId", {
      params: {
        productId: dbOrder.ProductProductId
      }
    }).pipe(
      tap((tapProduct: any) => console.log(JSON.stringify("Tap Product: " + tapProduct))),
      map(
        (product: any) => {
          return new OrderToDisplay(
            dbOrder.orderId,
            dbOrder.user,
            dbOrder.ProductProductId,
            product.title,
            product.image,
            product.description,
            product.price,
            "first Name",
            "Las tName",
            address[0],
            address[1],
            address[2],
            address[3],
            dbOrder.paymentOption,
            dbOrder.orderStatus
          );
        }
      )
    );
*/


}
