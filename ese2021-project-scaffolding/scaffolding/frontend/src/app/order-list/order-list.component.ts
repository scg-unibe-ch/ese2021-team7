import {Component, OnInit} from '@angular/core';
import {User} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {Order} from "../models/order.model";
import {environment} from "../../environments/environment";
import {OrderState} from "./order/order-state";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  currentUser: User | undefined;

  orderList : Order [] = [];

  constructor(
    public httpClient: HttpClient,
    private route: Router,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    // Listen for changes
    this.userService.user$.subscribe(res => {
      this.currentUser = res;
    })
    //current Value
    this.currentUser = this.userService.getUser();
    console.log('User Id is: ' + this.currentUser?.userId);
    this.getListOfOrder();
  }

  getListOfOrder(): void {
    if (typeof this.currentUser != 'undefined') {
      this.orderList = [];
      if(this.currentUser.isAdmin){
        this.getAllOrders;
      }
      else {
        this.getOrdersByUserId()
      }
    }
    else console.log("No orders available for undefined user.")
  }

  getOrdersByUserId(): void {
    this.mockOrders();
    //TODO connect backend
    /*
    this.orderList = [];
    this.httpClient.get(environment.endpointURL + "order/getById", {
      params: {
        userId: this.currentUser?.userId
      }
    }).subscribe((res: any) => {
        res.forEach((order: any) => {
          this.orderList.push(
            new Order(
              order.orderId,
              order.orderListId, // to indicate that it belongs to a certain oder list
              order.costumerId, // userId of the user which places the order
              order.productId, // to indicate which product is sold
              order.firstName,
              order.lastName,
              order.street,
              order.houseNumber,
              order.zipCode,
              order.city,
              order.paymentMethod,
              order.state)
        )})
      },
      (error: any) => {
        console.log(error);
      });

     */
  }

  getAllOrders(): void {
    this.orderList = [];
    this.httpClient.get(environment.endpointURL + "order/all").subscribe((res: any) => {
      console.log(res);
      res.forEach((order: any) => {
          this.orderList.push(
            new Order(
              order.orderId,
              order.orderListId, // to indicate that it belongs to a certain oder list
              order.costumerId, // userId of the user which places the order
              order.productId, // to indicate which product is sold
              order.firstName,
              order.lastName,
              order.street,
              order.houseNumber,
              order.zipCode,
              order.city,
              order.paymentMethod,
              order.state)
          )})
    }, (error: any) => {
      console.log(error);
    });
  }

  buttonClicked():void{
    this.getListOfOrder();
  }

  mockOrders(): void {
    this.orderList.push(new Order(
      1,
      2, // to indicate that it belongs to a certain oder list
      8, // userId of the user which places the order
      2, // to indicate which product is sold
      'MaxV',
      'MaxN',
      'MaxStreet',
      '4',
      '2',
      'MaxCity',
      'Cash',
      OrderState.Pending));
    this.orderList.push(new Order(
      1,
      2, // to indicate that it belongs to a certain oder list
      8, // userId of the user which places the order
      2, // to indicate which product is sold
      'MaxV',
      'MaxN',
      'MaxStreet',
      '4',
      '2',
      'MaxCity',
      'Cash',
      OrderState.Pending));
  }

}
