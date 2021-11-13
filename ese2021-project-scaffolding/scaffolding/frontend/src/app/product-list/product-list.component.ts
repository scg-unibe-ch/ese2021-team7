import { Component, OnInit } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Product} from "../models/product.model";
import {ProductList} from "../models/product-list.model";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";
import {Feed} from "../models/feed.model";
import {Post} from "../models/post.model";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  currentShop: ProductList = new ProductList(0,'', []);

  loggedIn: boolean | undefined;
  isAdmin: boolean | undefined;
  currentUser: User | undefined;

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
    this.userService.isAdmin$.subscribe( res => {
      this.isAdmin = res;
    });
    this.userService.user$.subscribe( res => {
      this.currentUser = res;
    })

    this.loggedIn = this.userService.getLoggedIn();
    this.isAdmin = this.userService.getIsAdmin();
    this.currentUser = this.userService.getUser();
  }

  // READ all created products
  readProducts(): void {
    this.currentShop.products.push(new Product(1,0,"Books","These are all books","https://cdn.shopify.com/s/files/1/0064/5342/8271/products/RHGT5-game-thrones-blood-red-front-1200.jpg?v=1556677054",100,"Books",false));
    this.currentShop.products.push(new Product(2,0,"Poster","This is a poster","https://tse3.mm.bing.net/th?id=OIP.ATDrvdlwYQboxpBGEeh3ZQHaLS&pid=Api",15,"Posters",false));

    /*
    this.httpClient.get(environment.endpointURL + "product/all").subscribe((res: any) => {
      console.log(res);
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
     */
  }

  // TODO: sortShop

  // TODO: addProduct
  addProduct(): void{
    console.log("Add button works.")
  }

  // TODO: deleteProduct
  deleteProduct(product: Product): void{
    console.log("Delete button works.")
  }

  // TODO: updateProduct
  updateProduct(product: Product): void{
    console.log("Update button works.")
  }

  // TODO: buyProduct
  buyProduct(product: Product): void{
    console.log("Buy button works.")
  }














}
