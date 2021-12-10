import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessPermission } from '../models/access-permission';
import { Category } from '../models/category';
import { FeaturePermission } from '../models/feature-permission';
import { PermissionType } from '../models/permission-type';
import { User } from '../models/user.model';
import { CategoryService } from '../services/category.service';
import { PermissionService } from '../services/permission.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
/**
 * Base component for app.
 *
 * Handles user management and permissions.
 */
export class BaseComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  //User
  loggedIn = false;
  //currentUser: User = new User(0, '', '', false,'','','','','','','','','', new AccessPermission(false, false, false, false, false, false, false, false), new FeaturePermission(false, false, false, false));
  currentUser: User | undefined;
  isLoading: boolean = false;

  // Access permissions for componoents
  // to be overwritten by child
  permissionToAccess: PermissionType = PermissionType.AccessHome;
  routeIfNoAccess: string = "";
  queryParmasIfNoAccess: string ="";

  //categories for posts and products
  productCategories: Category[] = [];
  postCategories: Category[] = [];

  // Services
  protected userService: UserService;
  protected permissionService: PermissionService;
  protected router: Router;
  protected categoryService: CategoryService

  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(injector: Injector) {
    this.userService = injector.get(UserService);
    this.permissionService = injector.get(PermissionService);
    this.router = injector.get(Router);
    this.categoryService = injector.get(CategoryService);
  }

  /*******************************************************************************************************************
   * LIFECYCLE HOOKS
   ******************************************************************************************************************/

  ngOnInit(): void {
  }


  checkUserStatus(): void {
    this.userService.checkUserStatus();
  }

  /*******************************************************************************************************************
   * HELPER METHODS
   ******************************************************************************************************************/

  /**
   * Gets current user from UserService and sets up listener.
   *
   * Must be set in child classes in ngOnInit.
   */
  initializeUser(): void {
    // Listen for changes
    this.userService.loggedIn$.subscribe(res => this.loggedIn = res);
    this.userService.user$.subscribe(res => this.currentUser = res);

    // Current value
    this.loggedIn = this.userService.getLoggedIn();
    this.currentUser = this.userService.getUser();

    //listener
    this.userService.loading$.subscribe(res => this.isLoading = res);

    this.checkUserStatus();
  }

  /**
   * Evaluates if User/Admin has access to the component.
   * Otherwise, re-routes to given set route.
   *
   * Must be set by child in ngOnInit.
   */
  evaluateAccessPermissions(): boolean {
    if(!this.permissionService.evaluateAccessPermissions(this.loggedIn, this.currentUser, this.permissionToAccess)) {
      this.reRouteIfNoAccess(this.routeIfNoAccess, this.queryParmasIfNoAccess);
    }
    return true;
    }

  /**
   * Re-routes if user has no access.
   *
   * @param route
   * @param queryParams
   */
  protected reRouteIfNoAccess(route: string, queryParams?: any): void {
    if(queryParams){
      this.router.navigate([route], {queryParams: queryParams}).then((r:any) =>{});
    }
    else{
      this.router.navigate([route]).then((r:any) =>{});
    }
  }


  /**
   * Gets current user from UserService and sets up listener.
   *
   * Must be set in child classes in ngOnInit.
   */
  initializeCategories(): void {
    //listener for product categories
    this.categoryService.productCategories$.subscribe(res => this.productCategories = res);
    //current value of product categories
    this.productCategories = this.categoryService.getProductCategories();
    //listener for post categories
    this.categoryService.postCategories$.subscribe(res => this.postCategories = res);
    //current value of post categories
    this.postCategories = this.categoryService.getPostCategories();
  }


}
