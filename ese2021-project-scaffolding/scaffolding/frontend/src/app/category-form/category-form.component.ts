import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../base-form/base-form.component';
import { FormType } from '../models/form-type';
import { FormService } from '../services/form.service';

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
              public formService: FormService,
              public router: Router,
              public route: ActivatedRoute) {
    super(fb, formService, router, route);
  }

  ngOnInit(): void {
    this.initializeForm(this.formType);
  }



}
