import { Component, Injector, OnInit } from '@angular/core';
import {User} from "../models/user.model";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import { AccessPermission } from '../models/access-permission';
import { BaseComponent } from '../base/base.component';
import { SelectHouseComponent } from '../select-house/select-house.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent extends BaseComponent implements OnInit {

  //loggedIn: boolean | undefined;
  //currentUser: User = new User(0, '', '', false,'','','','','','','','','', new AccessPermission(false, false, false, false, false, false, false, false, false));
  address : String | undefined;
  birthday: String | undefined;

  constructor(public injector: Injector,
              private dialog: MatDialog,

  ) {
    super(injector);
  }

  ngOnInit(): void {

    super.initializeUser();

    //current Value
    //this.loggedIn = this.userService.getLoggedIn();
    //this.currentUser = this.userService.getUser();
    if(typeof this.currentUser != 'undefined'){
      this.address = this.currentUser.street + " " + this.currentUser.houseNumber + ", " + this.currentUser.zipCode + " " + this.currentUser.city;
      this.birthday = this.currentUser.birthday.substring(8,10) + "." + this.currentUser.birthday.substring(5,7) + "." + this.currentUser.birthday.substring(0,4);
    }
  }

  viewOrders():void {
    this.router.navigate(['/order'], {queryParams : {userId : this.currentUser?.userId}})
  }


  chooseHouse(): void{
    const dialogRef = this.dialog.open(SelectHouseComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      console.log("dialog closed");
    });
  }

}
