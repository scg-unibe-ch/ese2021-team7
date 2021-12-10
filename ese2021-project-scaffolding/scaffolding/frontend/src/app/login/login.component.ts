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

  //loggedIn: boolean | undefined;

  //user: User | undefined;

  fromRegistration: boolean | undefined;

  userToLogin: User = new User(0, '', '', false,'','','','','','','','','', new AccessPermission(false, false, false, false, false, false, false, false), new FeaturePermission(false, false, false, false));

  endpointLogin: string = '';

  fromShop: boolean = false;

  constructor(
    public httpClient: HttpClient,
    private route: ActivatedRoute,
    public injector: Injector
  ) {
    super(injector);
  }


  ngOnInit(): void {
    super.initializeUser();
    this.route.queryParams.subscribe( params =>{
      if(params['registered']== 'true'){
        this.fromRegistration = true;
      }
      else if(params['fromShop'] == 'true'){
        this.fromShop = params['fromShop'];
      }
    })
  }

  loginUser(): void {
    this.userService.loginUser(this.userToLogin)
      .subscribe((res: any) => {
        console.log(JSON.stringify(res));
      localStorage.setItem('userToken', res.token);
      localStorage.setItem('userId', res.user.userId);
      this.userService.setLoggedIn(true);
      this.userService.setUser(this.userService.createUserFromBackendReponse(res.user));
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


   /*
    this.httpClient.post(environment.endpointURL + "user/login", {
      userName: this.userToLogin.username,
      password: this.userToLogin.password,
      email: this.userToLogin.email
    }).subscribe((res: any) => {
      localStorage.setItem('userName', res.user.userName);
      localStorage.setItem('email', res.user.email);
      localStorage.setItem('userToken', res.token);
      localStorage.setItem('userId', res.userId);

      this.userService.setLoggedIn(true);

      if(res.user.admin){
        this.userService.setUser(new User(res.user.userId, res.user.userName, res.user.password,res.user.admin,res.user.firstName,
          res.user.lastName,res.user.email,res.user.street,res.user.houseNumber,res.user.zipCode,res.user.city,
          res.user.birthday,res.user.phoneNumber, this.permissionService.getAdminAccessPermissions(), this.permissionService.getAdminFeaturePermissions()));
      } else {
        this.userService.setUser(new User(res.user.userId, res.user.userName, res.user.password, res.user.admin, res.user.firstName,
          res.user.lastName, res.user.email, res.user.street, res.user.houseNumber, res.user.zipCode, res.user.city,
          res.user.birthday, res.user.phoneNumber, this.permissionService.getUserAccessPermissions(), this.permissionService.getUserFeaturePermissions()));
      }

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
  }*/

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

  clearEmailField(): void {
    this.userToLogin.email = '';
  }

  clearUserNameField(): void {
    this.userToLogin.username = '';
  }

  resetLoginForm(){
    this.userToLogin.username = this.userToLogin.email = this.userToLogin.password = '';
  }

  logoutUser(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userToken');

    this.userService.setLoggedIn(false);
    this.userService.setUser(undefined);

    //this.router.navigate(['../feed']).then(r =>{});
  }
}
