import {Component, OnInit} from '@angular/core';
import {User} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {Order} from "../models/order.model";
import {environment} from "../../environments/environment";
import {OrderState} from "./order/order-state";
import {OrderComponent} from "./order/order.component";
import { OrderListServiceService } from '../services/order-list-service.service';
import { OrdersDataSourceService } from '../services/orders-data-source.service';
import {MatTable, MatTableModule} from '@angular/material/table';
import { ProductService } from '../services/product.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {  ViewChild } from '@angular/core';
import { concat } from 'rxjs';
import { ConfirmationDialogModel } from '../ui/confirmation-dialog/confirmation-dialog';
import { ConfirmationDialogComponent } from '../ui/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  currentUser: User | undefined;
  isAdmin: boolean | undefined;


  //used for table design
  displayedColumns: string[] = [];
  dataSource: OrdersDataSourceService | undefined;


  constructor(
    public httpClient: HttpClient,
    private router: Router,
    public userService: UserService,
    private orderListService: OrderListServiceService,
    private ordersDataSource: OrdersDataSourceService,
    public productService: ProductService,
    private dialog: MatDialog
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

    this.setDisplayedColumns();
    this.initializeDataSource(this.isAdmin);
  }


  shipOrder(row: any): void {
    console.log("shipping: " + JSON.stringify(row.orderId));
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
          this.refreshTable(this.currentUser?.userId);
        }
      );
  }


  refreshTable(userId?: number): void {
    if(userId!= null){
      this.dataSource?.loadOrders(userId)
    }
    else {
      this.dataSource?.loadOrders();
    }
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


  initializeDataSource(isAdmin: undefined | boolean): void{
    //this.getListOfOrder();
    this.dataSource = new OrdersDataSourceService(this.orderListService, this.productService, this.httpClient);
    if(isAdmin) {
      this.dataSource.loadOrders();
    }
    else{
      this.dataSource.loadOrders(this.currentUser?.userId);
    }

  }


  confirmationCancel(row: any): void {
    const dialogData = new ConfirmationDialogModel('Confirm', 'Are you sure you want to cancel this order?','Keep','Cancel order');
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
      data: dialogData
    })
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.cancelOrder(row);
      }
    });
  }


  confirmationShip(row:any): void{
    const dialogData = new ConfirmationDialogModel('Confirm', 'Ship order?','Discard','Ship');
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
      data: dialogData
    })
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.shipOrder(row);
      }
    });
  }




}
