import { Inject } from '@angular/core';
import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseFormComponent } from '../base-form/base-form.component';
import { FormType } from '../models/form-type';
import { SelectHouseFormService } from '../services/select-house-form.service';

@Component({
  selector: 'app-select-house',
  templateUrl: './select-house.component.html',
  styleUrls: ['./select-house.component.css']
})
export class SelectHouseComponent extends BaseFormComponent implements OnInit {

  /*******************************************************************************************************************
   * VARIABLES
   ******************************************************************************************************************/

    // overrides parent variables
  protected formType = FormType.SelectHouse;
  form: FormGroup = new FormGroup({});
  requestType = "user/discoverHouse";

  isLoading: boolean = false;



  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    public injector: Injector,
    public selectHouseFormService: SelectHouseFormService,
    private dialogRef: MatDialogRef<SelectHouseComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: {userId: number}
  ) {
    super(selectHouseFormService, injector);
  }

  ngOnInit(): void {
    //this.preSets = this.dialogData.userId;
    //super.ngOnInit();
    this.isLoading = true
    super.initializeForm(this.dialogData?.userId | 0); // put 0 for test not to crash. Otherwise initialize with undefined
    this.isLoading = false;
  }


  /**
   * Closes dialog box if user clicks on "Discard" button.
   */
  discardChanges(): void {
    this.dialogRef.close(); //closes dialog box
  }

}
