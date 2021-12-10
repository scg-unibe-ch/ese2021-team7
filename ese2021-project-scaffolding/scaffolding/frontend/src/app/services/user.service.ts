import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import {Observable, Subject } from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { AccessPermission } from '../models/access-permission';
import { FeaturePermission } from '../models/feature-permission';
import { UserBackendService } from './user-backend.service';
import { PermissionService } from './permission.service';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  private loggedIn: boolean = false;

  private user: User = new User(0, '', '', false,'','','','','','','','','', new AccessPermission(false, false, false, false, false, false, false, false), new FeaturePermission(false, false, false, false));


  /*******************************************************************************************************************
   * OBSERVABLE SOURCES & STREAMS
   ******************************************************************************************************************/

  // Observable Sources
  private loggedInSource = new Subject<boolean>();
  private userSource = new Subject<User>();

  // Observable Streams
  loggedIn$ = this.loggedInSource.asObservable();
  user$ = this.userSource.asObservable();


  /*******************************************************************************************************************
   * GETTERS
   ******************************************************************************************************************/

  getLoggedIn(): boolean  {
    return this.loggedIn;
  }

  getUser(): User {
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
    if(!this.loggedIn) {
      console.log("loggedin " + this.loggedIn);
      let userId = localStorage.getItem('userId');
      if (userId) {
        console.log("User Id from local storage: " + userId);
        this.userBackendService.getUserByIdAsObservable(Number(userId))
          .subscribe(user => {
            console.log("relogin: " + JSON.stringify(user));
            this.setUser(this.createUserFromBackendReponse(user));
            this.setLoggedIn(true);
          })
      } else {
        this.setLoggedIn(false);
      }
    }
  }


  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    private userBackendService: UserBackendService,
  private permissionService: PermissionService,
private httpClient: HttpClient) {
    // Observer
    this.loggedIn$.subscribe(res => this.loggedIn = res);
    this.user$.subscribe(res => this.user = res);

    // Default values
    this.setLoggedIn(false);
  }

  /*******************************************************************************************************************
   * LOGIN
   ******************************************************************************************************************/

  loginUser(userToLogin: User): Observable<any> {
    return this.httpClient.post(environment.endpointURL + "user/login", {
      userName: userToLogin.username,
      password: userToLogin.password,
      email: userToLogin.email
    });
  }

  /*******************************************************************************************************************
   * HELPER METHODS
   ******************************************************************************************************************/


  createUserFromBackendReponse(res: any): User {
    if (res.admin) {
      return new User(res.userId, res.userName, res.password, res.admin, res.firstName,
        res.lastName, res.email, res.street, res.houseNumber, res.zipCode, res.city,
        res.birthday, res.phoneNumber, this.permissionService.getAdminAccessPermissions(), this.permissionService.getAdminFeaturePermissions());
    } else {
      return new User(res.userId, res.userName, res.password, res.admin, res.firstName,
        res.lastName, res.email, res.street, res.houseNumber, res.zipCode, res.city,
        res.birthday, res.phoneNumber, this.permissionService.getUserAccessPermissions(), this.permissionService.getUserFeaturePermissions());
    }
  }


}
