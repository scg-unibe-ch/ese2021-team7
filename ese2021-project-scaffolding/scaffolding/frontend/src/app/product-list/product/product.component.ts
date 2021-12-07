import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output} from '@angular/core';
import {Product} from "../../models/product.model";
import {User} from "../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../services/user.service";
import { Category } from '../../models/category';
import { CategoryService } from 'src/app/services/category.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

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
  loggedIn : boolean | undefined;

  @Input()
  currentUser : User = new User(0, '', '', false,'','','','','','','','','');

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
    //public httpClient: HttpClient,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    //private categoryService: CategoryService,
    @Optional () private dialogRef: MatDialogRef<ProductComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: {showDetails: boolean, product: Product, user: User, isLoggedIn: boolean} //used to get Data in Dialog Box
  ) {
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit(): void {
/*    // Listen for changes
    this.userService.loggedIn$.subscribe(res => this.loggedIn = res);
    // Current value
    this.loggedIn = this.userService.getLoggedIn();*/

   if(this.dialogData?.showDetails){
      this.showDetailedView = this.dialogData?.showDetails;
      this.productToDisplay = this.dialogData?.product;
      this.currentUser = this.dialogData?.user;
      this.loggedIn = this.dialogData?.isLoggedIn;
      console.log(JSON.stringify(this.currentUser));
    }

    this.evaluateUpdateDeletePermission();
    this.evaluateBuyNowPermission();


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
    this.evaluateUpdateDeletePermission();
    this.evaluateBuyNowPermission();
  }

  /*******************************************************************************************************************
   * USER ACTIONS
   ******************************************************************************************************************/

  updateProduct(): void {
    // Emits event to parent component that Product got updated
    if (this.showDeleteAndUpdateButton){
      this.update.emit(this.productToDisplay);
      this.dialogRef.close({updateProduct: true, product: this.productToDisplay});
    }
  }

  deleteProduct(): void {
    // Emits event to parent component that Product got deleted
    if (this.showDeleteAndUpdateButton){
      this.delete.emit(this.productToDisplay);
      this.dialogRef.close({deleteProduct: true, product: this.productToDisplay});
    }
  }

  showProductDetails(): void{
    this.showDetails.emit(this.productToDisplay);
    //this.router.navigate(['/product'],{queryParams: {productId: this.productToDisplay.productId, showDetailedView: 'true'}}).then(r =>{});
  }

  closeDetailedView(): void{
    this.showDetailedView = false;
    this.dialogRef.close(); //closes dialog box
    //this.router.navigate(['/shop']).then(r =>{});
  }

  buyProduct(): void {
    // Emits event to parent component that Product is purchased
    if (this.showBuyNowButton){
      if (this.loggedIn){
        this.buy.emit(this.productToDisplay);
        this.dialogRef.close({buyProduct: true, product: this.productToDisplay});
      }
      else {
        //console.log("Login to buy this product")
        // redirect to login if user is not logged in
        this.router.navigate(['/login'],{queryParams: {fromShop: 'true'}}).then(r =>{});
      }
    }
  }

  /*******************************************************************************************************************
   * PERMISSIONS
   ******************************************************************************************************************/

  evaluateUpdateDeletePermission(): void {
    // set true if user is admin
    if (this.loggedIn){
      if (this.currentUser.isAdmin) this.showDeleteAndUpdateButton = true;
      else this.showDeleteAndUpdateButton = false;
    }
    else this.showDeleteAndUpdateButton = false;
  }

  evaluateBuyNowPermission(): void {
    // set true if user is admin
    if (this.loggedIn){
      if (this.currentUser.isAdmin) {
        console.log("Buy button disabled;")
        this.showBuyNowButton = false;
      }
      else {
        console.log("Buy button enabled;")
        this.showBuyNowButton= true;
      }
    }
    else this.showBuyNowButton= true;
    console.log("nothing applies: " + this.showBuyNowButton);
  }


}
