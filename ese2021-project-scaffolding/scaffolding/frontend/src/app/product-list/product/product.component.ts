import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from "../../models/product.model";
import {User} from "../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../services/user.service";
import { Category } from '../../models/category';
import { CategoryService } from 'src/app/services/category.service';

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

  showDetailedView: boolean = false;

  productCategories: Category[];

  @Input()
  loggedIn : boolean | undefined;

  @Input()
  currentUser : User = new User(0, '', '', false,'','','','','','','','','');

  @Input()
  productToDisplay: Product = new Product(0,0,'','','',0,new Category(0,"undefined", 1),false);

  @Output()
  update = new EventEmitter<Product>();

  @Output()
  delete = new EventEmitter<Product>();

  @Output()
  buy = new EventEmitter<Product>();

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);

    // Current value
    this.loggedIn = userService.getLoggedIn();
  }

  ngOnInit(): void {
    this.productCategories = this.categoryService.getProductCategories();
    this.evaluateUpdateDeletePermission();
    this.evaluateBuyNowPermission();

    this.route.queryParams.subscribe(params => {
      if(params['showDetailedView'] == 'true'){
        // get Product
        this.httpClient.get(environment.endpointURL + "product/byId", {
          params: {
            productId: params['productId']
          }
        }).subscribe((product: any) => {
            this.productToDisplay = new Product(product.productId, 0, product.title, product.description, product.image, product.price, this.categoryService.getCategoryById(product.productCategory), !product.isAvailable);
            console.log(this.categoryService.getCategoryById(product.productCategory));
            this.showDetailedView = true;
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
    console.log(this.showBuyNowButton);
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

  showProductDetails(): void{
    this.router.navigate(['/product'],{queryParams: {productId: this.productToDisplay.productId, showDetailedView: 'true'}}).then(r =>{});
  }

  closeDetailedView(): void{
    this.showDetailedView = false;
    this.router.navigate(['/shop']).then(r =>{});
  }

  buyProduct(): void {
    // Emits event to parent component that Product is purchased
    if (this.showBuyNowButton && !this.showDetailedView){
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
