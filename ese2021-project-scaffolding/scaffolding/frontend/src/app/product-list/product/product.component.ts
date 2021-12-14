import { Component, EventEmitter, Inject, Injector, Input, OnInit, Optional, Output} from '@angular/core';
import {Product} from "../../models/product.model";
import {User} from "../../models/user.model";
import {ActivatedRoute} from "@angular/router";
import { Category } from '../../models/category';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent extends BaseComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  // DOM related switches
  showDeleteAndUpdateButton : boolean = false;
  showBuyNowButton: boolean = false;
  showDetailedView: boolean = false;

  /*******************************************************************************************************************
   * INPUTS
   ******************************************************************************************************************/

  @Input()
  loggedIn : boolean  = false;

  @Input()
  currentUser: User | undefined;

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
    private route: ActivatedRoute,
    public injector: Injector,
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
    }

   if(this.currentUser == undefined) {
     this.showBuyNowButton = true;
   } else {
     if (!this.loggedIn) this.showBuyNowButton = true;
     else if(this.currentUser.featuresPermissions) {
       this.showBuyNowButton = this.currentUser?.featuresPermissions?.purchaseProduct;
       this.showDeleteAndUpdateButton = this.currentUser?.featuresPermissions?.productUpdateDelete;
     }
   }
  }

  /*******************************************************************************************************************
   * USER ACTIONS
   ******************************************************************************************************************/

  /**
   * Emits event to parent component that Product got updated
   */
  updateProduct(): void {
    if (this.showDeleteAndUpdateButton && !this.productToDisplay.sold){
      this.update.emit(this.productToDisplay);
      this.dialogRef?.close({updateProduct: true, product: this.productToDisplay});
    }
  }

  /**
   * Emits event to parent component that Product got deleted
   */
  deleteProduct(): void {
    if (this.showDeleteAndUpdateButton  && !this.productToDisplay.sold){
      this.delete.emit(this.productToDisplay);
      this.dialogRef?.close({deleteProduct: true, product: this.productToDisplay});
    }
  }

  showProductDetails(): void{
    this.showDetails.emit(this.productToDisplay);
  }

  closeDetailedView(): void{
    this.showDetailedView = false;
    this.dialogRef?.close(); //closes dialog box
  }

  /**
   * Emits event to parent component that Product is purchased
   */
  buyProduct(): void {
    if (this.showBuyNowButton){
      if (this.loggedIn){
        this.buy.emit(this.productToDisplay);
        this.dialogRef?.close({buyProduct: true, product: this.productToDisplay});
      }
      else {
        // redirect to login if user is not logged in
        this.router.navigate(['/login'],{queryParams: {fromShop: 'true'}}).then(r =>{});
        this.dialogRef?.close({buyProduct: true, product: this.productToDisplay});
      }
    }
  }

}
