import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import {BehaviorSubject, Observable, Subject } from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { AccessPermission } from '../models/access-permission';
import { FeaturePermission } from '../models/feature-permission';
import { PermissionService } from './permission.service';
import { FormGroup } from '@angular/forms';
import { map, tap } from 'rxjs/operators';
import { House } from '../models/house';
import { OrderListServiceService } from './order-list-service.service';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  private loggedIn: boolean = false;
  private user: User | undefined;

  private isLoading: boolean = false;

  /*******************************************************************************************************************
   * OBSERVABLE SOURCES & STREAMS
   ******************************************************************************************************************/

  // Observable Sources
  private loggedInSource = new Subject<boolean>();
  private userSource = new Subject<User>();
  private loadingSource = new BehaviorSubject<boolean>(false);

  // Observable Streams
  loggedIn$ = this.loggedInSource.asObservable();
  user$ = this.userSource.asObservable();
  loading$ = this.loadingSource.asObservable();


  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    private permissionService: PermissionService,
    private httpClient: HttpClient,
    private orderListService: OrderListServiceService
  ) {
    // Observer
    this.loggedIn$.subscribe(res => this.loggedIn = res);
    this.user$.subscribe(res => this.user = res);

    // Default values
    this.setLoggedIn(false);
  }


  /*******************************************************************************************************************
   * GETTERS
   ******************************************************************************************************************/

  getLoggedIn(): boolean  {
    return this.loggedIn;
  }

  getUser(): User | undefined {
    return this.user;
  }


  /*******************************************************************************************************************
   * SETTERS
   ******************************************************************************************************************/

  setLoggedIn(loggedIn: boolean | undefined): void {
    this.loggedInSource.next(loggedIn);
  }

  setUser(user: User | undefined): void {
    this.userSource.next(user);
  }

  /*******************************************************************************************************************
   * CHECK STATUS
   ******************************************************************************************************************/

  checkUserStatus(): void {
    this.loadingSource.next(true);
    if(!this.loggedIn) {
      console.log("loggedin " + this.loggedIn);
      let userId = localStorage.getItem('userId');
      if (userId) {
        console.log("User Id from local storage: " + userId);
        this.getUserByIdAsObservable(Number(userId))
          .subscribe(user => {
            console.log("relogin: " + JSON.stringify(user));
            this.setUser(this.createUserFromBackendReponse(user));
            this.setLoggedIn(true);
          })
      } else {
        this.setLoggedIn(false);
      }
    }
    this.loadingSource.next(false);
  }


  /*******************************************************************************************************************
   * LOGIN
   ******************************************************************************************************************/

  /**
   * Sends 'user/login' request to backend.
   *
   * Sets UserService/LocalStorage on logged in in case of success.
   *
   * @param userToLogin
   */
  loginUser(userToLogin: User): Observable<any> {
    return this.httpClient.post(environment.endpointURL + "user/login", {
      userName: userToLogin.username,
      password: userToLogin.password,
      email: userToLogin.email
    }).pipe(
      tap((res: any) => {
        localStorage.setItem('userToken', res.token);
        localStorage.setItem('userId', res.user.userId);
        this.setLoggedIn(true);
        this.setUser(this.createUserFromBackendReponse(res.user));
      })
    );
  }

  /**
   * Performs logout.
   */
  logoutUser(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userToken');

    this.setLoggedIn(false);
    this.setUser(undefined);
  }

  /*******************************************************************************************************************
   * HELPER METHODS
   ******************************************************************************************************************/

  createUserFromBackendReponse(res: any): User {
    let user = new User(res.userId, res.userName, res.password, res.admin, res.firstName,
      res.lastName, res.email, res.street, res.houseNumber, res.zipCode, res.city,
      res.birthday, res.phoneNumber, House.default);
    //set correct permissions
    if (res.admin) {
      user.setAccessPermissions(this.permissionService.getAdminAccessPermissions());
      user.setFeaturesPermissions(this.permissionService.getAdminFeaturePermissions());
    } else {
      user.setAccessPermissions(this.permissionService.getUserAccessPermissions());
      user.setFeaturesPermissions(this.permissionService.getUserFeaturePermissions());
    }
    //check if user can select House
    if (res.house) {
      if (user.featuresPermissions) user.featuresPermissions.setSelectHousePermission(true);
    } else {
    if (user.featuresPermissions) user.featuresPermissions.setSelectHousePermission(false);
    }
    return user;
  }

  /*******************************************************************************************************************
   * BACKEND METHODS
   ******************************************************************************************************************/


  getUserById(userId: number): User | undefined{
    let user = undefined;
    this.httpClient.get(environment.endpointURL + "user/getById", {
      params: {
        userId: userId
      }
    }).subscribe(res => user=res);
    return user;

  }

  getUserByIdAsObservable(userId: number): Observable<any> {
    return this.httpClient.get(environment.endpointURL + "user/getById", {
      params: {
        userId: userId
      }
    });
  }


  /*******************************************************************************************************************
   * SELECT HOUSE
   ******************************************************************************************************************/

  checkSelectHousePermission(user: User): Observable<any>{
    return this.orderListService.getAllOrders(user.userId)
      .pipe(
        map((orders: Order[]) => {
          let filteredOrders: Order[] = orders.filter((order: Order) => order.orderStatus == "Shipped");
          return filteredOrders.length >= 2;
        }),
    );
  }

}
