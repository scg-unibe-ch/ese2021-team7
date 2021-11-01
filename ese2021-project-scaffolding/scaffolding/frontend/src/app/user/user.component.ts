import { Component } from '@angular/core';
import { User } from '../models/user.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

  loggedIn: boolean | undefined;

  user: User | undefined;

  fromRegistration: boolean;

  userToLogin: User = new User(0, '', '', '','','','','','','','','');

  endpointMsgUser: string = '';
  endpointMsgAdmin: string = '';
  endpointLogin: string = '';

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Listen for changes
    userService.loggedIn$.subscribe(res => this.loggedIn = res);
    userService.user$.subscribe(res => this.user = res);

    // Current value
    this.loggedIn = userService.getLoggedIn();
    this.user = userService.getUser();
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe( params =>{
      if(params['registered']== 'true'){
        this.fromRegistration = true;
        /*
        console.log(params);
        this.httpClient.post(environment.endpointURL + "user/login", {
          userName: params['userName'],
          password: params['password'],
        }).subscribe((res: any) => {
          localStorage.setItem('userName', res.user.userName);
          localStorage.setItem('email', res.user.email);
          localStorage.setItem('userToken', res.token);

          this.userService.setLoggedIn(true);
          this.userService.setUser(new User(res.user.userId, res.user.userName, res.user.password,res.user.firstName,
            res.user.lastName,res.user.email,res.user.street,res.user.houseNumber,res.user.zipCode,res.user.city,
            res.user.birthday,res.user.phoneNumber));

          this.resetLoginForm();
          this.endpointLogin = '';
          this.router.navigate(['/feed']);
        }, (error) => {
          this.handleLoginError(error);
          this.resetLoginForm();

        });*/
      }
    })

}

  loginUser(): void {
    this.httpClient.post(environment.endpointURL + "user/login", {
      userName: this.userToLogin.username,
      password: this.userToLogin.password,
      email: this.userToLogin.email
    }).subscribe((res: any) => {
      localStorage.setItem('userName', res.user.userName);
      localStorage.setItem('email', res.user.email);
      localStorage.setItem('userToken', res.token);

      this.userService.setLoggedIn(true);
      this.userService.setUser(new User(res.user.userId, res.user.userName, res.user.password,res.user.firstName,
        res.user.lastName,res.user.email,res.user.street,res.user.houseNumber,res.user.zipCode,res.user.city,
        res.user.birthday,res.user.phoneNumber));

      this.resetLoginForm();
      this.endpointLogin = '';
    }, (error) => {
      this.handleLoginError(error);
      this.resetLoginForm();
    });
  }

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
    localStorage.removeItem('userName');
    localStorage.removeItem('email');
    localStorage.removeItem('userToken');

    this.userService.setLoggedIn(false);
    this.userService.setUser(undefined);
  }

/*  accessUserEndpoint(): void {
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
  }*/
}
