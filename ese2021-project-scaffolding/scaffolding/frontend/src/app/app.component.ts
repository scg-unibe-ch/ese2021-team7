import { Component, Injector, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoList } from './models/todo-list.model';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import {ActivatedRoute, Router} from "@angular/router";
import { BaseComponent } from './base/base.component';
import { PermissionType } from './models/permission-type';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

    title = 'Game of Thrones';

  // overrides
  permissionToAccess = PermissionType.AccessHome;
  routeIfNoAccess: string = "/home";





 // enableCreatePost: boolean = false;

  //used for sidenav
  events: string[] = [];
  opened: boolean | undefined;

  //used for Admin Dashboard
  //isAdmin = false;

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    public httpClient: HttpClient,
    private route: ActivatedRoute,
    public injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    super.initializeUser();
    super.evaluateAccessPermissions();
    //this.getCurrentUser();
  }

  /*getCurrentUser(): void {
    // listen for changes in loggedIn
    this.userService.loggedIn$.subscribe(res => {
      this.loggedIn = res
    }, error => {
      this.enableCreatePost = false;
    });
    // listen for changes in current user
    this.userService.user$.subscribe(res => {
      //this.enableCreatePost = true;
      this.user = res;
      this.enableCreatePost = this.checkPermissionConditions(res?.isAdmin);
      this.isAdmin = res?.isAdmin;
    }, error => {
      this.enableCreatePost = false;
      this.checkPermissionConditions(false)
    });
    // Current value
    this.user = this.userService.getUser();
    this.enableCreatePost = this.checkPermissionConditions(this.user?.isAdmin);
  }*/

/*  checkPermissionConditions(isAdmin: boolean | undefined): boolean {
    if(this.userService.getLoggedIn() && !isAdmin){
      return true;
    }
    return  false;
  }*/

  logoutUser(): void {
    this.userService.logoutUser();
    this.router.navigate(['../home']).then(r =>{});
    /*    localStorage.removeItem('userId');
        localStorage.removeItem('userToken');

        this.userService.setLoggedIn(false);
        this.userService.setUser(undefined);
        this.router.navigate(['../home']).then(r =>{});*/
  }

}
