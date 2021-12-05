import {CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ShopService } from './shop.service';

@Injectable({
  providedIn: 'root'
})
export class ShopDataSourceService extends DataSource<Product[]> {


  /*******************************************************************************************************************
   * Observables & Streams
   ******************************************************************************************************************/

    // categories data
  private shopSource = new BehaviorSubject<Product[]>([]);

  // used for loading
  private loadingSource = new BehaviorSubject<boolean>(false);

  // stream of loading
  public loading$ = this.loadingSource.asObservable();

  /*******************************************************************************************************************
   * Constructor
   ******************************************************************************************************************/

  constructor(private shopService: ShopService) {
    super();
    this.refreshData();
  }

  /*******************************************************************************************************************
   * Interface Methods
   ******************************************************************************************************************/

  //  interface method
  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.shopSource.asObservable();
  }

  // interface method
  disconnect(collectionViewer: CollectionViewer): void {
    this.shopSource.complete();
    this.loadingSource.complete();
  }

  /*******************************************************************************************************************
   * Get data
   ******************************************************************************************************************/

  /**
   * Gets categories from backend and emits via laodingSource.
   */
  refreshData(): void {
    this.loadingSource.next(true);
    this.shopService.getProductsFromBackendAsObservable().
    subscribe(
      (res: any) => {
        this.shopSource.next(res); //pass to BehaviourSubject
        this.loadingSource.next(false);
      }
    );
  }

}
