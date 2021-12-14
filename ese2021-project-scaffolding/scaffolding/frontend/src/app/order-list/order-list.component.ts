import {Component, Injector, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { OrderListServiceService } from '../services/order-list-service.service';
import { OrdersDataSourceService } from '../services/orders-data-source.service';
import { ProductService } from '../services/product.service';
import { ConfirmationDialogModel } from '../ui/confirmation-dialog/confirmation-dialog';
import { ConfirmationDialogComponent } from '../ui/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent extends BaseComponent implements OnInit {


  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  //used for table design
  displayedColumns: string[] = [];
  dataSource: OrdersDataSourceService | undefined;

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/
  constructor(
    public httpClient: HttpClient,
    private orderListService: OrderListServiceService,
    private ordersDataSource: OrdersDataSourceService,
    public productService: ProductService,
    private dialog: MatDialog,
    public injector: Injector
  ) {
    super(injector);
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit(): void {
    super.ngOnInit();
    this.setDisplayedColumns(); // different columns for user and admin
    if(this.currentUser != undefined) {
      this.initializeDataSource(this.currentUser.isAdmin); //admin sees all orders, user only their own
    }
  }

  /*******************************************************************************************************************
   * USER ACTIONS
   ******************************************************************************************************************/

  /**
   * Opens dialog box to confirm cancelletion of order.
   *
   * @param row
   */
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

  /**
   * Opens dialog box to confirm shipment of order.
    * @param row
   */
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

  /**
   * Ships order
   * @param row: row in data table.
   */
  shipOrder(row: any): void {
    this.orderListService.shipOrder(row.orderId)
      .subscribe((data: any) => {
        this.refreshTable();
        }
        );
  }

  /**
   * Cancels order
   * @param row: in data table.
   */
  cancelOrder(row: any): void {
    this.orderListService.cancelOrder(row.orderId)
      .subscribe((data: any) => {
          this.refreshTable(this.currentUser?.userId);
        }
      );
  }


  /*******************************************************************************************************************
   * HELPER METHODS
   ******************************************************************************************************************/

  /**
   * Refreshes data source.
   * @param userId: if provided, only gets orders for this user.
   */
  refreshTable(userId?: number): void {
    if(userId!= null){
      this.dataSource?.loadOrders(userId)
    }
    else {
      this.dataSource?.loadOrders();
    }
  }

  /**
   * Defines columns in DOM for admin and for user.
   */
  setDisplayedColumns(): void{
    if(this.currentUser == undefined) {
      this.displayedColumns = [];
    } else if(this.currentUser.isAdmin){
        this.displayedColumns =   ['orderId',  'productId', 'productName',
          'productPrice', 'customerId', 'firstName', 'lastName',
          'street', 'houseNumber', 'zipCode', 'city', 'paymentMethod',
          'orderStatus', 'actions'];
      }
      else {
        this.displayedColumns =   ['orderId',  'productName',
          'firstName', 'lastName',
          'street', 'houseNumber', 'zipCode', 'city', 'paymentMethod', 'productPrice',
          'orderStatus', 'actions'];
      }
  }

  /**
   * Loads data in data source.
   *
   * Admins can see all orders. Users can only see their own.
   *
   * @param isAdmin
   */
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

}
