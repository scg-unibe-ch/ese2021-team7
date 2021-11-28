import { Injectable } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Order } from '../models/order.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import { OrderListServiceService } from './order-list-service.service';
import { of } from 'rxjs';
import { catchError, concatMap, finalize, map, mergeMap, tap } from 'rxjs/operators';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';
import { OrderToDisplay } from '../models/order-to-display';


@Injectable({
  providedIn: 'root'
})
export class OrdersDataSourceService implements DataSource<Order>{

  private ordersSubject = new BehaviorSubject<OrderToDisplay[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private orderListService: OrderListServiceService, public productService: ProductService) {}

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.ordersSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.ordersSubject.complete();
    this.loadingSubject.complete();
  }

  /*
  loadAllOrders() {

    this.loadingSubject.next(true);

    this.orderListService.getAllOrders().pipe(
      catchError(error => of([error])),
      finalize(() => this.loadingSubject.next(false)),
      tap((data:any) => console.log("Tap call:" + JSON.stringify(data))),
      map( (responseData: Order[]) => {
        let ordersToDisplay: any[] = [];
        responseData.map(
          order => {
            console.log(order.productId);
            this.productService.getProductById(order.productId)
              .pipe(tap((tapProduct:any) => {console.log("Tap Product: " +JSON.stringify(tapProduct))}))
              .subscribe(
              (product: any) => {
                console.log("Product answer recieved");
                console.log(JSON.stringify(product));
                ordersToDisplay.push(new OrderToDisplay(
                   order.orderId,
                   order.costumerId, // userId of the user which places the order
                   order.productId, // to indicate which product is sold
                   product.title,
                   product.image,
                   product.Description,
                   product.price,
                   order.firstName,
                   order.lastName,
                   order.street,
                   order.houseNumber,
                   order.zipCode,
                   order.city,
                   order.paymentMethod,
                   3
                ));
              },
              (error: any) => console.log(error));
            console.log("Array orders: " + JSON.stringify(ordersToDisplay));
          }
        );
        console.log("WHAT SHOULD BE: " + JSON.stringify(responseData));
        return responseData;
      }
      )
    ).subscribe((orders: any) => {
        console.log(orders);
        this.ordersSubject.next(orders);
  });
  }
*/
/*
  loadAllOrders() {

    this.loadingSubject.next(true);

    this.orderListService.getAllOrders().pipe(
      catchError(error => of([error])),
      finalize(() => this.loadingSubject.next(false)),
      tap((data:any) => console.log("Tap call:" + JSON.stringify(data)))
    )
      .subscribe((orders: Order[]) => {
        const ordersToDisplay: any[] = [];
        orders.map(
          (order: Order) => {
            console.log(order.productId);
            this.productService.getProductById(order.productId)
              .pipe(tap((tapProduct:any) => {console.log("Tap Product: " +JSON.stringify(tapProduct))}))
              .subscribe(
                (product: any) => {
                  console.log("Product answer recieved");
                  console.log(JSON.stringify(product));
                  ordersToDisplay.push(new OrderToDisplay(
                    order.orderId,
                    order.costumerId, // userId of the user which places the order
                    order.productId, // to indicate which product is sold
                    product.title,
                    product.image,
                    product.Description,
                    product.price,
                    order.firstName,
                    order.lastName,
                    order.street,
                    order.houseNumber,
                    order.zipCode,
                    order.city,
                    order.paymentMethod,
                    3
                  ));
                },
                (error: any) => console.log(error));
            console.log("Array orders: " + JSON.stringify(ordersToDisplay));
          }
        );
        console.log("WHAT SHOULD BE: " + JSON.stringify(orders));
        this.ordersSubject.next(ordersToDisplay);
    });
  }

*/

    loadAllOrders():void  {

      this.loadingSubject.next(true);

      this.orderListService.getAllOrders().pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
        tap((data:OrderToDisplay[]) => console.log("Tap call:" + data))
      ).subscribe((orders: OrderToDisplay[]) => {
            console.log(orders);
            this.ordersSubject.next(orders)});
        }

}
