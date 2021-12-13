import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '../base/base.component';
import { SelectHouseComponent } from '../select-house/select-house.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-house-selector',
  templateUrl: './house-selector.component.html',
  styleUrls: ['./house-selector.component.css']
})
export class HouseSelectorComponent extends BaseComponent implements OnInit {

  houseChosen: boolean = false;
  isLoading: boolean = false;
  house: string = "";
  clicked: boolean = false;

  constructor(
    public injector: Injector,
    private dialogRef: MatDialogRef<SelectHouseComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: {userId: number}
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }




  selectHouse(): void {
    this.isLoading = true;
    this.clicked = true;
    this.userService.selectHouse(this.dialogData.userId)
      .subscribe(house => {
        this.house = JSON.stringify(house);
        this.isLoading = false;
        },
        error => {
        this.house = JSON.stringify(error);
        this.isLoading = false;
        this.houseChosen = true;
        }
      );

  }


  close(): void {
    this.dialogRef.close();
  }


}
