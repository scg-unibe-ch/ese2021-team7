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
import {MatTable, MatTableModule} from '@angular/material/table';
import { ProductService } from '../services/product.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {  ViewChild } from '@angular/core';
import { concat } from 'rxjs';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  currentUser: User | undefined;
  isAdmin: boolean | undefined;



  //@ViewChild(MatTable) table: MatTable<any>;

  //user for table design
  displayedColumns: string[] = [];
  dataSource: OrdersDataSourceService | undefined;



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
    console.log("is currentuser admin: "+ this.currentUser?.isAdmin);
    this.isAdmin = this.currentUser?.isAdmin;

    //set displayed columns
    this.setDisplayedColumns();

    this.initializeDataSource();


  }


  shipOrder(row: any): void {
    console.log("shipping: " + JSON.stringify(row.orderId));
    //this.dataSource.shipOrder(row.orderId);
    this.orderListService.shipOrder(row.orderId)
      .subscribe((data: any) => {
        console.log(JSON.stringify(data));
        this.refreshTable();
        }
        );
  }

  cancelOrder(row: any): void {
    console.log("shipping: " + JSON.stringify(row.orderId));
    //this.dataSource.shipOrder(row.orderId);
    this.orderListService.cancelOrder(row.orderId)
      .subscribe((data: any) => {
          console.log(JSON.stringify(data));
          this.refreshTable(this.currentUser.userId);
        }
      );
  }



  refreshTable(userId?: number): void {
    if(userId!= null){
      this.dataSource.loadUserData(userId)
    }
    else {
      this.dataSource.loadAllOrders();
    }
    //this.table.renderRows();
  }


  setDisplayedColumns(): void{
    if(this.isAdmin){
      this.displayedColumns =   ['orderId',  'productId', 'productName',
        'productPrice', 'customerId', 'firstName', 'lastName',
        'street', 'houseNumber', 'zipCode', 'city', 'paymentMethod',
        'orderStatus', 'actions'];
    }
    else {
      this.displayedColumns =   ['orderId',  'productName',
        'firstName', 'lastName',
        'street', 'houseNumber', 'zipCode', 'city', 'productPrice',
        'orderStatus', 'actions'];
    }
  }


  initializeDataSource(): void{
    //this.getListOfOrder();
    this.dataSource = new OrdersDataSourceService(this.orderListService, this.productService, this.httpClient);
    if(this.isAdmin) {
      this.dataSource.loadAllOrders();
    }
    else{
      this.dataSource.loadUserData(this.currentUser?.userId);
    }

  }



}
