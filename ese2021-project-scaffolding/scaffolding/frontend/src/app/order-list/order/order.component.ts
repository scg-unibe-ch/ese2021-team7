import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Order} from "../../models/order.model";
import {environment} from "../../../environments/environment";
import {OrderState} from "./order-state";
import {User} from "../../models/user.model";
import {Product} from "../../models/product.model";

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

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router) {
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
    this.httpClient.get(environment.endpointURL + "product/byId", {
      params: {
        // TODO use right productId
        // productId: productId
        productId: 1
      }
    }).subscribe((res: any) => {
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
    // only enable if orderState is pending
    this.updateOrder(OrderState.Cancelled);
    this.orderToDisplay.state = OrderState.Cancelled;
    this.showStateChangeButton = false;
  }

  shipOrder() {
    // only enable if orderState is pending
    this.updateOrder(OrderState.Shipped);
    this.orderToDisplay.state = OrderState.Shipped;
    this.showStateChangeButton = false;
  }

  updateOrder(state: OrderState): void{
    console.log('Update Button works.')
    // TODO update order with right call
    /*
    this.httpClient.post(environment.endpointURL + "order/byId", {
      params: {
        orderId: this.orderId,
        orderState: state
      }
    }).subscribe((res: any) => {
      console.log(res);
      this.currentOrder = new Order(
        res.orderId,
        res.orderListId, // to indicate that it belongs to a certain oder list
        res.costumerId, // userId of the user which places the order
        res.productId, // to indicate which product is sold
        res.firstName,
        res.lastName,
        res.street,
        res.houseNumber,
        res.zipCode,
        res.city,
        res.paymentMethod,
        res.state
      );
      this.showChangeStateButton = false;
    }, (error: any) => {
      console.log(error);
    })
     */

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
