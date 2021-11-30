import {Component, OnInit} from '@angular/core';
import {User} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {Order} from "../models/order.model";
import {environment} from "../../environments/environment";
import {OrderState} from "./order/order-state";
import { OrderListServiceService } from '../services/order-list-service.service';
import { OrdersDataSourceService } from '../services/orders-data-source.service';
import {MatTableModule} from '@angular/material/table';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  currentUser: User | undefined;

  orderList : Order [] = [];


  //user for table design
  displayedColumns: string[] = ['orderId',  'productId', 'productName', 'productPrice', 'customerId', 'firstName', 'lastName', 'street', 'houseNumber', 'zipCode', 'city', 'paymentMethod', 'orderStatus'];
  dataSource: OrdersDataSourceService;


  constructor(
    public httpClient: HttpClient,
    private router: Router,
    public userService: UserService,
    private orderListService: OrderListServiceService,
    private ordersDataSource: OrdersDataSourceService,
    public productService: ProductService
  ) {}

  ngOnInit(): void {
    // Listen for changes
    this.userService.user$.subscribe(res => {
      this.currentUser = res;
    })
    //current Value
    this.currentUser = this.userService.getUser();
    this.getListOfOrder();
    this.dataSource = new OrdersDataSourceService(this.orderListService, this.productService, this.httpClient);
    this.dataSource.loadAllOrders();
  }

  getListOfOrder(): void {
    if (typeof this.currentUser != 'undefined') {
      this.orderList = [];
      if(this.currentUser.isAdmin){
        this.getAllOrders();
      }
      else {
        this.getOrdersByUserId();
      }
    }
    else {
      console.log("No orders available for undefined user.");
      this.router.navigate(['/feed'], {queryParams : {loggedIn : 'false'}});
    }
  }

  getOrdersByUserId(): void {
    this.orderList = [];
    let id = this.currentUser?.userId;
    if(typeof id != 'undefined'){
      this.httpClient.get(environment.endpointURL + "order/byUser", {
        params: {
          userId: id
        }
      }).subscribe((res: any) => {
          console.log(res);
          res.forEach((order: any) => {
            let array = order.deliveryAdress.split(' ');
            while (array.length<4){
              array.push("");
            }
            //TODO check if hard coding is correct
            let orderState;
            switch (order.orderStatus){
              case 1: {
                orderState = OrderState.Shipped;
                break;
              }
              case 2: {
                orderState = OrderState.Cancelled;
                break;
              }
              default: {
                orderState = OrderState.Pending;
                break;
              }
            }
            this.orderList.push(
              new Order(
                order.orderId,
                order.orderListId, // to indicate that it belongs to a certain oder list
                order.user, // userId of the user which places the order
                order.productId, // to indicate which product is sold
                order.firstName,
                order.lastName,
                array[0],
                array[1],
                array[2],
                array[3],
                order.paymentMethod,
                orderState)
            )})
        },
        (error: any) => {
          console.log(error);
        });
    }
    else console.log('Id was undefined')
  }

  getAllOrders(): void {
    this.orderList = [];
    this.httpClient.get(environment.endpointURL + "order/all").subscribe((res: any) => {
      console.log(res);
      res.forEach((order: any) => {
        let array = order.deliveryAdress.split(' ');
        while (array.length<4){
          array.push("");
        }
          this.orderList.push(
            new Order(
              order.orderId,
              order.orderListId, // to indicate that it belongs to a certain oder list
              order.costumerId, // userId of the user which places the order
              order.productId, // to indicate which product is sold
              order.firstName,
              order.lastName,
              array[0],
              array[1],
              array[2],
              array[3],
              order.paymentMethod,
              order.state));
      })
    }, (error: any) => {
      console.log(error);
    });
  }

}
