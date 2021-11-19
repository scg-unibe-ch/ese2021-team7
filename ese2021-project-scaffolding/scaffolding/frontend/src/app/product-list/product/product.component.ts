import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from "../../models/product.model";
import {User} from "../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";

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

  showProductDetails: boolean = false;

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

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.evaluateUpdateDeletePermission();
    this.evaluateBuyNowPermission();
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
    this.showProductDetails = true;
  }

  hideDetails(): void{
    this.showProductDetails = false;
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
