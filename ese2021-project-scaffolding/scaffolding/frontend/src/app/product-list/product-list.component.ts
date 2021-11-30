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
import {Post} from "../models/post.model";

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

  filterBy: string = '';

  productCategories: string[] = []; //['Memorabilia', 'Fanart', 'Posters'];

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
    this.getProductCategories();
  }

  ngOnChange():void {
    this.evaluateAddProductPermission();
    this.getProductCategories();
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
      this.currentShop = new ProductList(0, '', []);
      res.forEach((product: any) => {
        this.httpClient.get(environment.endpointURL + "category/byId",{
          params: {
            categoryId: product.productCategory
          }
        }).subscribe((res:any) => {
          if (this.checkIfProductIsAcceptedByFilter(res.name)) {
            this.currentShop.products.push(
              new Product(product.productId, 0, product.title, product.description, product.image, product.price, res.name, !product.isAvailable))
          }
        });
      });
    });
  }

  refreshShop(): void {
    this.filterBy = '';
    this.readProducts();
    this.getProductCategories();
  }

  addProduct(): void {
    if (this.currentUser?.isAdmin){
      this.route.navigate(['/product-form'],{queryParams: {create: 'true'}}).then(r => {})
    }
  }

  deleteProduct(product: Product): void {
    this.handleDelete(product);
  }

  updateProduct(product: Product): void {
    this.route.navigate(['/product-form'],{queryParams: {update: 'true', productId: (product.productId)}}).then(r => {})
  }

  buyProduct(product: Product): void {
    this.route.navigate(['/purchase'],{queryParams: {productId: (product.productId)}}).then(r => {})
  }

  handleDelete(product: Product): void {
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

  filterShop(event:any): void {
    this.readProducts();
  }

  checkIfProductIsAcceptedByFilter(category: string): boolean {
    if (this.filterBy == ''){
      return true;
    }
    else{
      if (this.filterBy == category){
        return true;
      }
      else return false;
    }
  }

  getProductCategories(): void {
    this.productCategories = [];
    this.httpClient.get(environment.endpointURL + "category/all").subscribe((res:any) => {
      res.forEach((category: any) => {
        if (category.type == 1){
          this.productCategories.push(category.name)
        }
      });
    });
  }
}
