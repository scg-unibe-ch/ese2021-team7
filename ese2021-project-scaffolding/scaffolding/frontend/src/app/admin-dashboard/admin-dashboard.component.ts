import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { PermissionType } from '../models/permission-type';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent extends BaseComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  // overrides
  permissionToAccess = PermissionType.AccessAdminDashBoard;
  routeIfNoAccess: string = "/home";

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    public injector: Injector
              ) {
    super(injector);
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit(): void {
    super.ngOnInit();
    super.evaluateAccessPermissions();
  }
}
