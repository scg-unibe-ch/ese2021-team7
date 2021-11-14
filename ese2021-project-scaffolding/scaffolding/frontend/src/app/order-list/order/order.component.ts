import {Component, OnInit} from '@angular/core';
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
export class OrderComponent implements OnInit {

  currentOrder: Order = new Order(0,0,0,0,'','','','','','','',OrderState.Pending);

  currentUser: User | undefined;

  currentProduct: Product | undefined;

  orderId : number = 0;

  orderAddress: String = '';

  showChangeStateButton: boolean = true;


  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router) {

  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getCurrentOrderById();
  }

  /* TODO
  - Show all propertys of order
  - state of order can be changed:  pending -> shipped by admin
                                    pending -> cancelled by user
   */

  getCurrentUser(){
    this.userService.user$.subscribe( (res: User) => {
      this.currentUser = res;
      // show component if user logged in (admin or user)
      // show admin view for admins, userView if user and customer are the same
      this.evaluateViewComponent();
    })
    //current Value
    this.currentUser = this.userService.getUser();
    this.evaluateViewComponent();
  }

  evaluateViewComponent(): void {
    if (typeof this.currentUser != 'undefined' && typeof this.currentOrder != 'undefined') {
      // check if customerId is same as userId
      if(!this.currentUser.isAdmin){
        if(this.currentUser?.userId != this.currentOrder?.costumerId){
          console.log('redirected due to incompatible customer and user Id')
          // TODO navigate to product list
          // this.router.navigate(['/shop']);
        }
      }
    }
  }

  getCurrentOrderById(): void{
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
    });
    if(this.orderId != 0 && typeof this.orderId != 'undefined') {
      this.httpClient.get(environment.endpointURL + "order/byId", {
        params: {
          orderId: this.orderId
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
        )
        this.orderAddress = res.street + " " + res.houseNumber + " " + res.zipCode + " " + res.city;
        console.log(this.currentOrder);
        this.evaluateViewComponent();
        this.getOrderProduct(res.productId);
        //TODO check how OrderState is sent from backend String?
        if (res.state==OrderState.Pending) this.showChangeStateButton = true;
        else this.showChangeStateButton = false;
      }, (error: any) => {
        console.log(error);
      });
    }
  }

  getOrderProduct(productId: number): void {
    this.httpClient.get(environment.endpointURL + "product/byId", {
      params: {
        productId: productId
      }
    }).subscribe((res: any) => {
      this.currentProduct = new Product(
        res.productId,
        res.shopId,
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
  }

  shipOrder() {
    // only enable if orderState is pending
    this.updateOrder(OrderState.Shipped);
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
}
