import { Component } from '@angular/core';
import { User } from '../models/user.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  loggedIn: boolean | undefined;

  user: User | undefined;

  userToRegister: User = new User(0, '', '', '','','','','','','','','');

  userToLogin: User = new User(0, '', '', '','','','','','','','','');

  endpointMsgUser: string = '';
  endpointMsgAdmin: string = '';
  endpointLogin: string = '';

  constructor(
    public httpClient: HttpClient,
    public userService: UserService
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    userService.user$.subscribe(res => this.user = res);

    // Current value
    this.loggedIn = userService.getLoggedIn();
    this.user = userService.getUser();
  }

  registerUser(): void {
    this.httpClient.post(environment.endpointURL + "user/register", {
      userName: this.userToRegister.username,
      password: this.userToRegister.password,
      firstName: this.userToRegister.firstName,
      lastName: this.userToRegister.lastName,
      email: this.userToRegister.email,
      street: this.userToRegister.street,
      houseNumber: this.userToRegister.houseNumber,
      zipCode: this.userToRegister.zipCode,
      city: this.userToRegister.city,
      phoneNumber: this.userToRegister.phoneNumber,
      birthday: this.userToRegister.birthday
    }).subscribe((res: any) => {
      //console.log(res);
      this.userToRegister.username = this.userToRegister.password = this.userToRegister.firstName = this.userToRegister.lastName = this.userToRegister.email =
        this.userToRegister.street = this.userToRegister.houseNumber = this.userToRegister.zipCode = this.userToRegister.city = this.userToRegister.phoneNumber =
          this.userToRegister.birthday ='';
    });
  }

  loginUser(): void {
    this.httpClient.post(environment.endpointURL + "user/login", {
      userName: this.userToLogin.username,
      password: this.userToLogin.password,
      email: this.userToLogin.email
    }).subscribe((res: any) => {
      this.userToLogin.username = this.userToLogin.email = this.userToLogin.password = '';

      localStorage.setItem('userName', res.user.userName);
      localStorage.setItem('email', res.user.email);
      localStorage.setItem('userToken', res.token);

      this.userService.setLoggedIn(true);
      this.userService.setUser(new User(res.user.userId, res.user.userName, res.user.password,res.user.firstName,
        res.user.lastName,res.user.email,res.user.street,res.user.houseNumber,res.user.zipCode,res.user.city
        ,res.user.birthday,res.user.phoneNumber));
    }, (error) => {
      this.handleLoginError(error);
    });
  }

  handleLoginError(error: HttpErrorResponse){
    if(error.error.message == '21'){
      this.endpointLogin = "No username or email provided";
    }
    if(error.error.message.message == '22') {
      this.endpointLogin = "User not found";
    }
    if(error.error.message.message == '23') {
      this.endpointLogin = "Wrong password";
    }
    if(error.error.message == '24') {
      this.endpointLogin = "Illegal request format";
    }
  }

  logoutUser(): void {
    localStorage.removeItem('userName');
    localStorage.removeItem('email');
    localStorage.removeItem('userToken');

    this.userService.setLoggedIn(false);
    this.userService.setUser(undefined);
  }

  accessUserEndpoint(): void {
    this.httpClient.get(environment.endpointURL + "secured").subscribe(() => {
      this.endpointMsgUser = "Access granted";
    }, () => {
      this.endpointMsgUser = "Unauthorized";
    });
  }

  accessAdminEndpoint(): void {
    this.httpClient.get(environment.endpointURL + "admin").subscribe(() => {
      this.endpointMsgAdmin = "Access granted";
    }, () => {
      this.endpointMsgAdmin = "Unauthorized";
    });
  }
}
