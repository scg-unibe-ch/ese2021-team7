import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  @ViewChild('selectFilter') selectFilter!: MatSelect;

  productList: Product[] = [];

  loggedIn: boolean | undefined;
  currentUser: User | undefined;

  showAddProductButton: boolean = false;

  productCategories: Category[] = [];

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    public httpClient: HttpClient,
    private route: Router,
    public userService: UserService,
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private shopService: ShopService
  ) { }


  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit(): void {
    //listener for product categories
    this.categoryService.productCategories$.subscribe(res => this.productCategories = res);
    //current value of product categories
    this.productCategories = this.categoryService.getProductCategories();

    // Listen for changes
    this.userService.loggedIn$.subscribe(res => {
      this.loggedIn = res;
    });
    this.userService.user$.subscribe( res => {
      this.currentUser = res;
    })
    this.loggedIn = this.userService.getLoggedIn();
    this.currentUser = this.userService.getUser();

    this.evaluateAddProductPermission(); //check if user is admin and can add products

    // listern product list
    this.shopService.products$.subscribe(res => {this.productList = res;
    });
    // get current value products
    this.productList = this.shopService.getAllProducts();
  }

  ngOnChange():void {
    this.evaluateAddProductPermission();
  }

  ngDoCheck(): void {
    //current Value
    this.loggedIn = this.userService.getLoggedIn();
    this.currentUser = this.userService.getUser();
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
    this.route.navigate(['/purchase'],{queryParams: {productId: (product.productId)}}).then(r => {})
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

  /*******************************************************************************************************************
   * HELPER METHODS
   ******************************************************************************************************************/

  /**
   * Checks wheter user is admin and has permission to add new products.
   * Sets parameters accordingly.
   */
  evaluateAddProductPermission(): void {
    // set true if user is admin
    if (this.loggedIn){
      if (this.currentUser?.isAdmin) this.showAddProductButton = true;
      else this.showAddProductButton = false;
    }
    else this.showAddProductButton = false;
  }


  /**
   * Reloads shop.
   */
  refreshShop(): void {
    this.shopService.refresh();
    this.selectFilter.value = 0; //sets category filter to "no filter" in DOM
  }







}
