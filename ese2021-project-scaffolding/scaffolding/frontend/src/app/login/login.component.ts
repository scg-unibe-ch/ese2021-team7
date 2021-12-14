import { Component, Injector } from '@angular/core';
import { User } from '../models/user.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OnInit } from '@angular/core';
import { AccessPermission } from '../models/access-permission';
import { PermissionService } from '../services/permission.service';
import { BaseComponent } from '../base/base.component';
import { FeaturePermission } from '../models/feature-permission';

@Component({
  selector: 'app-user',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent implements OnInit{

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

  // flags used to display message/reroute
  fromRegistration: boolean | undefined;
  fromShop: boolean = false;

  userToLogin: User = new User(0, '', '', false,'','','','','','','','','', undefined , new AccessPermission(false, false, false, false, false, false, false, false), new FeaturePermission(false, false, false, false, false));

  endpointLogin: string = '';

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

  ngOnInit(): void {
    super.ngOnInit();

    // sets flags for
    // displays message if guest is routed here from registration
    //  re-routing if guest comes here from shop/wanting purchase a product and has to log in
    this.route.queryParams.subscribe( params =>{
      if(params['registered']== 'true'){
        this.fromRegistration = true;
      }
      else if(params['fromShop'] == 'true'){
        this.fromShop = params['fromShop'];
      }
    })
  }

  /*******************************************************************************************************************
   * USER ACTIONS
   ******************************************************************************************************************/
  /**
   * Logs in user.
   *
   * Re-routes in case of success, handles error otherwise.
   *
   */
  loginUser(): void {
    this.userService.loginUser(this.userToLogin)
      .subscribe((res: any) => {
        this.resetLoginForm();
        this.endpointLogin = '';
        if (this.fromShop){
          this.router.navigate(['/shop']).then(r =>{});
        }
        else{
          if(this.userService.getUser()?.isAdmin){
            this.router.navigate(['/admin-dashboard']).then(r =>{});
          }
          else {
            this.router.navigate(['/feed']).then(r => {});
          }
        }
      }, (error) => {
        this.handleLoginError(error);
        this.resetLoginForm();
      });
  }

  /**
   * Redirects user to registration form.
   *
   */
  goToRegistration(): void {
    this.router.navigate(['/registration']).then(r => {});
  }

  /*******************************************************************************************************************
   * HELPER METHODS
   ******************************************************************************************************************/

  /**
   * Handles login error.
   *
   * Displays correct error message depending on backend error code.
   *
   * @param error: backend error
   */
  handleLoginError(error: HttpErrorResponse){
    // if neither username, nor email are provided
    if(error.error.message == '21'){
      this.endpointLogin = "No username or email provided";
    }
    // wrong login information
    if(error.error.message == '22' || error.error.message == '23') {
      // for login with email
      if (this.userToLogin.username == ''){
        this.endpointLogin = "Wrong email or password";
      }
      // for login with username
      else{
        this.endpointLogin = "Wrong username or password";
      }
    }
    // if both, username and email are provided
    if(error.error.message == '24') {
      this.endpointLogin = "Illegal request format";
    }
  }

  /*******************************************************************************************************************
   * DOM METHODS
   ******************************************************************************************************************/

  clearEmailField(): void {
    this.userToLogin.email = '';
  }

  clearUserNameField(): void {
    this.userToLogin.username = '';
  }

  resetLoginForm(){
    this.userToLogin.username = this.userToLogin.email = this.userToLogin.password = '';
  }

}
