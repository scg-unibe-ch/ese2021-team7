import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
  requestType = "";


  /*******************************************************************************************************************
   * CONSTRUCTOR
   ******************************************************************************************************************/

  constructor(
    public injector: Injector,
    public selectHouseFormService: SelectHouseFormService,
    private dialogRef: MatDialogRef<SelectHouseComponent>,
  ) {
    super(selectHouseFormService, injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }


  /**
   * Closes dialog box if user clicks on "Discard" button.
   */
  discardChanges(): void {
    this.dialogRef.close(); //closes dialog box
  }

}
