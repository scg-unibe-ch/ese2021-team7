import {CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Category } from '../models/category';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Customized DataSource for categories data.
 *
 * Used in CategoryListComponent for mat-table display.
 *
 * @uses: CategoryService for backend requests.
 * @implements: DataSource
 */
export class CategoriesDataSourceService extends DataSource<Category[]>{

  /*******************************************************************************************************************
   * Observables & Streams
   ******************************************************************************************************************/

  // categories data
  private categorySource = new BehaviorSubject<Category[]>([]);

  // used for loading
  private loadingSource = new BehaviorSubject<boolean>(false);

  // stream of loading
  public loading$ = this.loadingSource.asObservable();

  /*******************************************************************************************************************
   * Constructor
   ******************************************************************************************************************/

  constructor(private categoryService: CategoryService) {
    super();
    this.refreshData();
  }

  /*******************************************************************************************************************
   * Interface Methods
   ******************************************************************************************************************/

  //  interface method
  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.categorySource.asObservable();
  }

  // interface method
  disconnect(collectionViewer: CollectionViewer): void {
    this.categorySource.complete();
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
    this.categoryService.getCategoriesFromBackendAsObservable().
    subscribe(
      (res: any) => {
        this.categorySource.next(res); //pass to BehaviourSubject
        this.loadingSource.next(false);
      }
    );
  }


}
