import { Component, OnInit } from '@angular/core';
import {User} from "../models/user.model";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  loggedIn: boolean | undefined;
  currentUser: User | undefined;
  address : String | undefined;

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    // Listen for changes
    this.userService.loggedIn$.subscribe(res => {
      this.loggedIn = res;
    });
    this.userService.user$.subscribe( res => {
      this.currentUser = res;
      this.address = this.currentUser.street + " " + this.currentUser.houseNumber + ", " + this.currentUser.zipCode + " " + this.currentUser.city;
    })

    //current Value
    this.loggedIn = this.userService.getLoggedIn();
    this.currentUser = this.userService.getUser();
    if(typeof this.currentUser != 'undefined'){
      this.address = this.currentUser.street + " " + this.currentUser.houseNumber + ", " + this.currentUser.zipCode + " " + this.currentUser.city;
    }
  }
}
