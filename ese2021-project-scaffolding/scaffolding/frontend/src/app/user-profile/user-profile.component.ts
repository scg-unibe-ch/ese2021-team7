import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { MatDialog } from '@angular/material/dialog';
import { HouseSelectorComponent } from '../house-selector/house-selector.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent extends BaseComponent implements OnInit {

  address : String | undefined;
  birthday: String | undefined;

  showSelectHouseButton: boolean = false;
  houseChosen: boolean = false;

  constructor(public injector: Injector,
              private dialog: MatDialog,

  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.initializeCurrentValues().subscribe(
      res => {
        console.log("arrival" + JSON.stringify(res));

        this.loggedIn = res[1];
        this.currentUser = res[2];
        this.postCategories = res[3];
        this.productCategories = res[4];

        console.log("user" + JSON.stringify(this.currentUser));

        //set birthday and address
        if (this.currentUser != undefined) {
          this.address = this.currentUser.street + " " + this.currentUser.houseNumber + ", " + this.currentUser.zipCode + " " + this.currentUser.city;
          if (this.currentUser.birthday) this.birthday = this.currentUser.birthday.substring(8, 10) + "." + this.currentUser.birthday.substring(5, 7) + "." + this.currentUser.birthday.substring(0, 4);
          else this.birthday = "";
          // check house permission
          if (!this.currentUser.house) {
            this.userService.checkSelectHousePermission(this.currentUser)
              .subscribe(res => {
                console.log("show button" + JSON.stringify(res));
                this.showSelectHouseButton = res;
              });
          } else {
            this.houseChosen = true;
          }
        }
      });
    super.setUpListeners();
  }

  viewOrders():void {
    this.router.navigate(['/order'], {queryParams: {userId: this.currentUser?.userId}}).then(r =>{});
   }


  chooseHouse(): void{
    const dialogRef = this.dialog.open(HouseSelectorComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
      data: {
        userId: this.currentUser?.userId
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {
        this.houseChosen = dialogResult;
      }
      this.houseChosen = true;
      console.log("dialog closed");
    });
  }

}
