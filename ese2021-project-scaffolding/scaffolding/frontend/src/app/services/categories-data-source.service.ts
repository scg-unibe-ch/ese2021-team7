import {CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesDataSourceService extends DataSource<Category[]>{


  private categorySource = new BehaviorSubject<Category[]>([]);

  constructor(private categoryService: CategoryService) {
    super();
    this.refreshData();
  }


  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.categoryService.categories$;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.categorySource.complete();
  }

  refreshData(): void {
    this.categoryService.getCategoriesFromBackendAsObservable().subscribe(
      (res: any) => this.categorySource.next(res)
    );
  }


}
