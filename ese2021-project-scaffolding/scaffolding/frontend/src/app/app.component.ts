import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoList } from './models/todo-list.model';
import { TodoItem } from './models/todo-item.model';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  todoLists: TodoList[] = [];

  newTodoListName: string = '';

  loggedIn: boolean | undefined;

  user: User | undefined;

  enableCreatePost: boolean = false;

  constructor(
    public httpClient: HttpClient,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    // listen for changes in loggedIn
    this.userService.loggedIn$.subscribe(res => {
      this.loggedIn = res
    }, error => {
      this.enableCreatePost = false;
    });
    // listen for changes in current user
    this.userService.user$.subscribe(res => {
      this.enableCreatePost = true;
      this.user = res;
    }, error => {
      this.enableCreatePost = false;
    });
    //listen for changes in admin
    this.userService.isAdmin$.subscribe(res => {
        this.enableCreatePost = this.checkPermissionConditions(res);
      },
      error => {
        this.checkPermissionConditions(false);
      })

    // Current value
    this.user = this.userService.getUser();
    this.enableCreatePost = this.checkPermissionConditions(this.userService.getIsAdmin());
  }

  checkPermissionConditions(isAdmin: boolean | undefined): boolean {
    if(this.userService.getLoggedIn() && !isAdmin){
      return true;
    }
    return  false;
  }

  logoutUser(): void {
    localStorage.removeItem('userName');
    localStorage.removeItem('email');
    localStorage.removeItem('userToken');

    this.userService.setLoggedIn(false);
    this.userService.setIsAdmin(false);
    this.userService.setUser(undefined);
    this.router.navigate(['../feed']).then(r =>{});
    this.enableCreatePost = this.checkPermissionConditions(this.userService.getIsAdmin());
  }



}
