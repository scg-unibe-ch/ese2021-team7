import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../base-form/base-form.component';
import { FormType } from '../models/form-type';
import { CategoryFormService } from '../services/category-form.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent extends BaseFormComponent implements OnInit {

  protected formType = FormType.Category;
  protected requestType = "category/create";
  protected routeAfterSuccess = "category-list";
  protected routeAfterDiscard = "category-list";

  constructor(public fb: FormBuilder,
              public categoryFormService: CategoryFormService,
              public router: Router,
              public route: ActivatedRoute,
              private dialogRef: MatDialogRef<CategoryFormComponent>) {
    super(fb, categoryFormService, router, route);
  }

  ngOnInit(): void {
    this.initializeForm(this.formType);
  }

  discard(): void {
    this.dialogRef.close();
  }

  reRouteAfterSuccess(route: string, queryParams?: any): void {
    this.dialogRef.close();
  }



}
