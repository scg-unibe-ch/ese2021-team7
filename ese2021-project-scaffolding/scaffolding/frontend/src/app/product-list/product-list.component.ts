import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Product} from "../models/product.model";
import {ProductList} from "../models/product-list.model";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogModel} from "../ui/confirmation-dialog/confirmation-dialog";
import {ConfirmationDialogComponent} from "../ui/confirmation-dialog/confirmation-dialog.component";
import {Post} from "../models/post.model";
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { ShopService } from '../services/shop.service';
import {DataSource } from '@angular/cdk/collections';
import { ShopDataSourceService } from '../services/shop-data-source.service';
import { Observable, of } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductComponent } from './product/product.component';
import { PermissionService } from '../services/permission.service';
import { AccessPermission } from '../models/access-permission';
import { BaseComponent } from '../base/base.component';
import { PermissionType } from '../models/permission-type';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent extends BaseComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  @ViewChild('selectFilter') selectFilter!: MatSelect;

  // Products in shop
  productList: Product[] = [];

  // Array with product categories
  productCategories: Category[] = [];

  // overrides
  permissionToAccess = PermissionType.AccessHome;
  routeIfNoAccess: string = "/home";

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    public httpClient: HttpClient,
    private dialog: MatDialog,
    private shopService: ShopService,
    public injector: Injector
  ) {
    super(injector);
  }


  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit(): void {
/*    //listener for product categories
    this.categoryService.productCategories$.subscribe(res => this.productCategories = res);
    //current value of product categories
    this.productCategories = this.categoryService.getProductCategories();*/

    super.initializeUser();
    super.evaluateAccessPermissions();
    super.initializeCategories();

    // listern product list
    this.shopService.products$.subscribe(res => {this.productList = res;
    });
    // get current value products
    this.productList = this.shopService.getAllProducts();

  }

  /*******************************************************************************************************************
   * USER ACTIONS
   ******************************************************************************************************************/

  /**
   * Opens Dialog box with with product create form in it.
   *
   */
  addProduct(): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
      data: {
        isUpdate: false,
        isCreate: true,
        productId: ""
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.shopService.refresh();
    });
  }

  /**
   * Opens Dialog box to confirm delete.
   *
   */
  confirmDelete(product: Product): void {
    const dialogData = new ConfirmationDialogModel('Confirm', 'Are you sure you want to delete this product?','Cancel','Delete product');
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.shopService.deleteProduct(product);
      }
    });
  }

  /**
   * Opens Dialog box with product update form in it.
   *
   */
  updateProduct(product: Product): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
      data: {
        isUpdate: true,
        isCreate: false,
        productId: product.productId
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.shopService.refresh();
    });
  }

  /**
   * Re-routes to purchase form for chosen product.
   * @param product: Product user wants to buy.
   */
  buyProduct(product: Product): void{
    this.router.navigate(['/purchase'],{queryParams: {productId: (product.productId)}}).then(r => {})
  }

  /**
   * Filters shop after product category if filter was selected by user.
   *
   * @param categoryId: Category to sort shop after.
   */
  filterShop(categoryId:any): void {
    if(categoryId == 0) {
      this.shopService.refresh();
    }
    else {
      this.shopService.filterShop(categoryId);
    }
  }

  /**
   * Shows product in dialog box with product details.
   *
   * Handels actions if user wants to buy product or admin update or delete.
   *
   * @param product: product to be shown in details view.
   */
  showProductDetails(product: Product): void{
    const dialogRef = this.dialog.open(ProductComponent, {
      width: '450px',
      data: {
        product: product,
        showDetails: true,
        user: this.currentUser,
        isLoggedIn: this.loggedIn
      }
    });
    dialogRef.afterClosed().subscribe(
      (res:any) => {
        if(res){
          if(res.buyProduct){ //if user wants to buy
            this.buyProduct(res.product);
          } else if(res.updateProduct){ // if admin wants to update
            this.updateProduct(res.product);
          } else if(res.deleteProduct) { //if admin wants to delete
            this.confirmDelete(res.product);
          }
        }
        //console.log("PRoduct to buy: " + JSON.stringify(res));
      }
    );
  }

  /*******************************************************************************************************************
   * HELPER METHODS
   ******************************************************************************************************************/

  /**
   * Reloads shop.
   */
  refreshShop(): void {
    this.shopService.refresh();
    this.selectFilter.value = 0; //sets category filter to "no filter" in DOM
  }

}
