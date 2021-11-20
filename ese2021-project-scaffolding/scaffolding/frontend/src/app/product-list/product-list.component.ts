import { Component, OnInit } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Product} from "../models/product.model";
import {ProductList} from "../models/product-list.model";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  currentShop: ProductList = new ProductList(0,'', []);

  loggedIn: boolean | undefined;
  currentUser: User | undefined;

  showAddProductButton: boolean = false;

  constructor(
    public httpClient: HttpClient,
    private route: Router,
    public userService: UserService
  ) {
    this.readProducts();
  }

  ngOnInit(): void {
    // Listen for changes
    this.userService.loggedIn$.subscribe(res => {
      this.loggedIn = res;
    });
    this.userService.user$.subscribe( res => {
      this.currentUser = res;
    })
    this.loggedIn = this.userService.getLoggedIn();
    this.currentUser = this.userService.getUser();

    this.evaluateAddProductPermission();
  }

  ngOnChange():void {
    this.evaluateAddProductPermission();
  }

  ngDoCheck(): void {
    //current Value
    this.loggedIn = this.userService.getLoggedIn();
    this.currentUser = this.userService.getUser();
  }

  evaluateAddProductPermission(): void {
    // set true if user is admin
    if (this.loggedIn){
      if (this.currentUser?.isAdmin) this.showAddProductButton = true;
      else this.showAddProductButton = false;
    }
    else this.showAddProductButton = false;
  }

  // READ all created products
  readProducts(): void {
    this.httpClient.get(environment.endpointURL + "product/all").subscribe((res: any) => {
      this.currentShop = new ProductList(0,'', []);
      res.forEach((product: any) => {
      if (!product.sold){
        this.currentShop.products.push(
              new Product(product.productId,0,product.title,product.description,product.image,product.price,product.category,product.sold))
              }
          },
          (error: any) => {
            console.log(error);
          });
      });
  }

  refreshShop() {
    this.readProducts();
  }

  // TODO: sortShop by Category

  addProduct(): void{
    if (this.currentUser?.isAdmin){
      this.route.navigate(['/product-form'],{queryParams: {create: 'true'}}).then(r => {})
    }
  }

  deleteProduct(product: Product): void{
    this.httpClient.post(environment.endpointURL + "product/delete", {
      productId: product.productId
    }).subscribe(() => {
      this.currentShop.products.splice(this.currentShop.products.indexOf(product), 1);
    });
  }

  updateProduct(product: Product): void{
    this.route.navigate(['/product-form'],{queryParams: {update: 'true', productId: (product.productId)}}).then(r => {})
  }

  buyProduct(product: Product): void{
    this.route.navigate(['/purchase'],{queryParams: {productId: (product.productId)}}).then(r => {})
  }
}
