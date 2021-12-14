import { Component, Injector, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  //used for sidenav
  events: string[] = [];
  opened: boolean | undefined;

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

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit() {
    super.initializeUser();
    super.evaluateAccessPermissions();
  }

  /*******************************************************************************************************************
   * USER ACTIONS
   ******************************************************************************************************************/

  logoutUser(): void {
    this.userService.logoutUser();
    this.router.navigate(['../home']).then(r =>{});
  }



}
