import { Component, OnInit } from '@angular/core';
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
    public userService: UserService,
    private dialog: MatDialog
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
    console.log("ngDoCheck is working.")
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
  }

  refreshShop() {
    this.readProducts();
  }

  // TODO: sortShop by Category

  // TODO: fix route according to create product component
  addProduct(): void{
    if (this.currentUser?.isAdmin){
      //this.route.navigate(['/createproduct'],{queryParams: {create: 'true', productId: (product.productId)}}).then(r => {})
      this.route.navigate(['/createproduct']).then(r => {})
    }
  }

  deleteProduct(product: Product): void{
    console.log("Delete button works.")
    this.handleDelete(product);
    /*this.httpClient.post(environment.endpointURL + "product/delete", {
      productId: product.productId
    }).subscribe(() => {
      this.currentShop.products.splice(this.currentShop.products.indexOf(product), 1);
    });
     */
  }

  // TODO: fix route according to create product component
  updateProduct(product: Product): void{
    console.log("Update button works.")
    //this.route.navigate(['/createproduct'],{queryParams: {update: 'true', productId: (product.productId)}}).then(r => {})
    this.route.navigate(['/createproduct']).then(r => {})
  }

  // TODO: fix route according to create product component
  buyProduct(product: Product): void{
    console.log("Buy button works.")
    //this.route.navigate(['/purchase'],{queryParams: {productId: (product.productId), userId: this.currentUser?.userId}}).then(r => {})
    this.route.navigate(['/purchase']).then(r => {})
  }

  handleDelete(product: Product): void{
    const dialogData = new ConfirmationDialogModel('Confirm', 'Are you sure you want to delete this product?');
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
      data: dialogData
    })

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.httpClient.post(environment.endpointURL + "product/delete", {
          productId: product.productId
        }).subscribe(() => {
          this.currentShop.products.splice(this.currentShop.products.indexOf(product), 1);
        });
      }
    });
  }














}
