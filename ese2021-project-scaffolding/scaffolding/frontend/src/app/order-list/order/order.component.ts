import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Order} from "../../models/order.model";
import {environment} from "../../../environments/environment";
import {OrderState} from "./order-state";
import {User} from "../../models/user.model";
import {Product} from "../../models/product.model";
import {ConfirmationDialogModel} from "../../ui/confirmation-dialog/confirmation-dialog";
import {ConfirmationDialogComponent} from "../../ui/confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnChanges{

  @Input()
  orderToDisplay: Order = new Order(0,0,0,0,'','','','','','','',OrderState.Pending);

  @Input()
  currentUser : User = new User(0, '', '', false,'','','','','','','','','');

  currentProduct: Product | undefined;

  orderId : number = 0;

  orderAddress: String = '';

  showStateChangeButton: boolean = true;

  productDefined: boolean = false;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getOrderProduct(this.orderToDisplay.productId);
    this.orderAddress = this.orderToDisplay.street + " "
      + this.orderToDisplay.houseNumber + " " + this.orderToDisplay.zipCode
      + " " + this.orderToDisplay.city;
    if (this.orderAddress == '   ') {
      this.orderAddress = 'no address';
    }
  }

  ngOnChanges(): void {
    this.evaluateViewComponent();
    this.getOrderProduct(this.orderToDisplay.productId);
  }

  evaluateViewComponent(): void {
    // double check for correct user and order
    if (typeof this.currentUser != 'undefined' && typeof this.orderToDisplay != 'undefined') {
      // check if customerId is same as userId
      if(!this.currentUser.isAdmin){
        // additional check if order belongs to user
        console.log('user hat id: ' + this.currentUser.userId + ' order wurde erstellt von user: ' + this.orderToDisplay.costumerId)
        if(this.currentUser?.userId != this.orderToDisplay.costumerId){
          console.log('redirected due to incompatible customer and user Id')
          this.router.navigate(['/shop']);
        }
      }
      if (this.orderToDisplay.state == OrderState.Pending) this.showStateChangeButton = true;
      else this.showStateChangeButton = false;
    }
  }

  getOrderProduct(productId: number): void {
    // TODO check if productId is sent from backend to order, use right productId
    this.httpClient.get(environment.endpointURL + "product/byId", {
      params: {
        productId: productId
      }
    }).subscribe((res: any) => {
      this.productDefined = true;
      this.currentProduct = new Product(
        res.productId,
        0,
        res.title,
        res.description,
        res.image,
        res.price,
        res.category,
        res.sold
        )
    }, (error: any) => {
      console.log(error);
    });
  }

  cancelOrder() {
    if (this.orderToDisplay.state == OrderState.Pending){
      this.handleCancel();
    }
  }

  handleCancel(): void {
    const dialogData = new ConfirmationDialogModel('Confirm', 'Are you sure you want to cancel this order?','No','Cancel order');
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
      data: dialogData
    })

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.httpClient.get(environment.endpointURL + "order/cancel").subscribe((res: any) => {
          console.log(res);
        }, (error: any) => {
          console.log(error);
        });
        // only enable if orderState is pending
        this.orderToDisplay.state = OrderState.Cancelled;
        this.showStateChangeButton = false;
      }
    });
  }

  shipOrder() {
    if (this.orderToDisplay.state == OrderState.Pending){
      this.handleShip();
    }
  }

  handleShip(): void {
    const dialogData = new ConfirmationDialogModel('Confirm', 'Are you sure you want to ship this order?','Cancel','Ship order');
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
      data: dialogData
    })

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.httpClient.get(environment.endpointURL + "order/ship").subscribe((res: any) => {
          console.log(res);
        }, (error: any) => {
          console.log(error);
        });
        this.orderToDisplay.state = OrderState.Shipped;
        this.showStateChangeButton = false;
      }
    });
  }

  deleteProduct($event: Product) {
    console.log("delete product should not be allowed here.")
  }

  updateProduct($event: Product) {
    console.log("update product should not be allowed here.")
  }

  buyProduct($event: Product) {
    console.log("buy product should not be allowed here.")
  }
}
