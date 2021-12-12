import { Component, EventEmitter, Inject, Injector, Input, OnInit, Optional, Output} from '@angular/core';
import {Product} from "../../models/product.model";
import {User} from "../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../services/user.service";
import { Category } from '../../models/category';
import { CategoryService } from 'src/app/services/category.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PermissionService } from 'src/app/services/permission.service';
import { AccessPermission } from 'src/app/models/access-permission';
import { FeaturePermission } from 'src/app/models/feature-permission';
import { BaseComponent } from 'src/app/base/base.component';
import {House} from "../../models/house";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent extends BaseComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  //product: Product | undefined;
  //productId: number | undefined;

  // DOM related switches
  showDeleteAndUpdateButton : boolean = false;
  showBuyNowButton: boolean = false;
  showDetailedView: boolean = false;

  /*******************************************************************************************************************
   * INPUTS
   ******************************************************************************************************************/

/*  @Input()
  productCategories: Category[] = [];*/

  @Input()
  loggedIn : boolean  = false;

  @Input()
  currentUser: User = new User(0, '', '', false,'','','','','','','','','', new AccessPermission(false, false, false, false, false, false, false, false), new FeaturePermission(false, false, false, false),House.default);

  @Input()
  productToDisplay: Product = new Product(0,'','','',0,new Category(0,"undefined", 1, "undefined"),false);

  /*******************************************************************************************************************
   * OUTPUTS
   ******************************************************************************************************************/

  @Output()
  update = new EventEmitter<Product>();

  @Output()
  delete = new EventEmitter<Product>();

  @Output()
  buy = new EventEmitter<Product>();

  @Output()
  showDetails = new EventEmitter<Product>();


  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    //public userService: UserService,
    private route: ActivatedRoute,
    public injector: Injector,
    //private router: Router,
    //private permissionService: PermissionService,
    @Optional () private dialogRef: MatDialogRef<ProductComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: {showDetails: boolean, product: Product, user: User, isLoggedIn: boolean} //used to get Data in Dialog Box
  ) {
    super(injector);
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit(): void {

   if(this.dialogData?.showDetails){
      this.showDetailedView = this.dialogData?.showDetails;
      this.productToDisplay = this.dialogData?.product;
      this.currentUser = this.dialogData?.user;
      this.loggedIn = this.dialogData?.isLoggedIn;
      console.log(JSON.stringify(this.currentUser));
    }

   if(!this.loggedIn) this.showBuyNowButton = true;
   else this.showBuyNowButton = this.currentUser?.featuresPermissions.purchaseProduct;
   this.showDeleteAndUpdateButton = this.currentUser?.featuresPermissions.productUpdateDelete;

   //this.setPermissions();
    //this.evaluateUpdateDeletePermission();
    //this.evaluateBuyNowPermission();


    /*    this.route.queryParams.subscribe(params => {
          if(params['showDetailedView'] == 'true'){
            // get Product
            this.httpClient.get(environment.endpointURL + "product/byId", {
              params: {
                productId: params['productId']
              }
            }).subscribe((product: any) => {
                this.productToDisplay = new Product(product.productId,  product.title, product.description, product.image, product.price, this.categoryService.getCategoryById(product.productCategory), !product.isAvailable);
                console.log(this.categoryService.getCategoryById(product.productCategory));
                this.showDetailedView = true;
              });
          }
          else{
            this.showDetailedView = false;
          }
        });*/
  }

  ngOnChange(): void {
    //this.setPermissions();
  }

  /*******************************************************************************************************************
   * USER ACTIONS
   ******************************************************************************************************************/

  updateProduct(): void {
    // Emits event to parent component that Product got updated
    if (this.showDeleteAndUpdateButton){
      this.update.emit(this.productToDisplay);
      this.dialogRef?.close({updateProduct: true, product: this.productToDisplay});
    }
  }

  deleteProduct(): void {
    // Emits event to parent component that Product got deleted
    if (this.showDeleteAndUpdateButton){
      this.delete.emit(this.productToDisplay);
      this.dialogRef?.close({deleteProduct: true, product: this.productToDisplay});
    }
  }

  showProductDetails(): void{
    this.showDetails.emit(this.productToDisplay);
    //this.router.navigate(['/product'],{queryParams: {productId: this.productToDisplay.productId, showDetailedView: 'true'}}).then(r =>{});
  }

  closeDetailedView(): void{
    this.showDetailedView = false;
    this.dialogRef?.close(); //closes dialog box
    //this.router.navigate(['/shop']).then(r =>{});
  }

  buyProduct(): void {
    // Emits event to parent component that Product is purchased
    if (this.showBuyNowButton){
      if (this.loggedIn){
        this.buy.emit(this.productToDisplay);
        this.dialogRef?.close({buyProduct: true, product: this.productToDisplay});
      }
      else {
        //console.log("Login to buy this product")
        // redirect to login if user is not logged in
        this.router.navigate(['/login'],{queryParams: {fromShop: 'true'}}).then(r =>{});
        this.dialogRef?.close({buyProduct: true, product: this.productToDisplay});
      }
    }
  }

/*  /!*******************************************************************************************************************
   * PERMISSIONS
   ******************************************************************************************************************!/

  setPermissions(): void{
    this.showDeleteAndUpdateButton = this.permissionService.evaluateUpdateDeletePermission(this.loggedIn, this.currentUser);
    this.showBuyNowButton = this.permissionService.evaluateBuyNowPermission(this.loggedIn, this.currentUser);
  }*/



}
