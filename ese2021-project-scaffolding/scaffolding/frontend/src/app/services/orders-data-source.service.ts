import { Injectable } from '@angular/core';
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import { OrderListServiceService } from './order-list-service.service';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';


@Injectable({
  providedIn: 'root'
})
/**
 * Used to display orders in table view.
 *
 * Implements DataSource interface.
 */
export class OrdersDataSourceService implements DataSource<Order[]>{

  /*******************************************************************************************************************
   * STREAMS & OBSERVABLES
   ******************************************************************************************************************/

  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(private orderListService: OrderListServiceService,
              public productService: ProductService,
              private httpClient: HttpClient) {}

  /*******************************************************************************************************************
   * INTERFACE METHODS
   ******************************************************************************************************************/

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.ordersSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.ordersSubject.complete();
    this.loadingSubject.complete();
  }

  /*******************************************************************************************************************
   * FETCHING DATA
   ******************************************************************************************************************/

    loadOrders(userId?: number): void  {
      this.loadingSubject.next(true); // set on "loading" while fetching data
      this.orderListService.getAllOrders(userId).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      ).subscribe((orders: Order[]) => {
            this.ordersSubject.next(orders)}); // pass on data to subject
    }


}
