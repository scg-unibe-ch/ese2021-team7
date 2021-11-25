import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from "../../models/product.model";
import {User} from "../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: Product | undefined;
  productId: number | undefined;

  showDeleteAndUpdateButton : boolean = false;
  showBuyNowButton: boolean = false;

  showDetailedView: boolean | undefined;

  @Input()
  loggedIn : boolean = false;

  @Input()
  currentUser : User = new User(0, '', '', false,'','','','','','','','','');

  @Input()
  productToDisplay: Product = new Product(0,0,'','','',0,'',false);

  @Output()
  update = new EventEmitter<Product>();

  @Output()
  delete = new EventEmitter<Product>();

  @Output()
  buy = new EventEmitter<Product>();

  constructor(public httpClient: HttpClient,private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.evaluateUpdateDeletePermission();
    this.evaluateBuyNowPermission();

    this.route.queryParams.subscribe(params => {
      if(params['showDetailedView'] == 'true'){
        // get Product
        this.httpClient.get(environment.endpointURL + "product/byId", {
          params: {
            productId: params['productId']
          }
        }).subscribe((res: any) => {
          this.productToDisplay = new Product(res.productId, 1, res.title,  res.description, res.image,  res.price, res.productCategory, false);
          this.showDetailedView = true;
        }, (error: any) => {
          console.log(error);
        });
      }
      else{
        this.showDetailedView = false;
      }
    });
  }

  ngOnChange(): void {
    this.evaluateUpdateDeletePermission();
    this.evaluateBuyNowPermission();
  }

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
      if (this.currentUser.isAdmin) this.showBuyNowButton = false;
      else this.showBuyNowButton= true;
    }
    else this.showBuyNowButton= true;
  }

  updateProduct(): void {
    // Emits event to parent component that Product got updated
    if (this.showDeleteAndUpdateButton){
      this.update.emit(this.productToDisplay);
    }
  }

  deleteProduct(): void {
    // Emits event to parent component that Product got deleted
    if (this.showDeleteAndUpdateButton){
      this.delete.emit(this.productToDisplay);
    }
  }

  showDetails(): void{
    this.router.navigate(['/product'],{queryParams: {productId: this.productToDisplay.productId, showDetailedView: 'true'}}).then(r =>{});
  }

  closeDetailedView(): void{
    this.router.navigate(['/shop']).then(r =>{});
  }

  buyProduct(): void {
    // Emits event to parent component that Product is purchased
    if (this.showBuyNowButton){
      if (this.loggedIn){
        this.buy.emit(this.productToDisplay);
      }
      else {
        console.log("Login to buy this product")
        // redirect to login if user is not logged in
        this.router.navigate(['/login'],{queryParams: {fromShop: 'true'}}).then(r =>{});
      }
    }
  }
}
