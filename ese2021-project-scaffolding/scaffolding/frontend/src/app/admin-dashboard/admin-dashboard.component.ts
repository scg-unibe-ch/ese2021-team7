import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';
import { AccessPermission } from '../models/access-permission';
import { PermissionType } from '../models/permission-type';
import { User } from '../models/user.model';
import { PermissionService } from '../services/permission.service';
import { UserService } from '../services/user.service';

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
    //super.initializeUser();
    //super.evaluateAccessPermissions();
    super.ngOnInit();
    super.evaluateAccessPermissions();
  }

}
