import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFormComponent } from './category-form.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatStepperModule} from "@angular/material/stepper";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTableModule} from "@angular/material/table";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSelectModule} from "@angular/material/select";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatMenuModule} from "@angular/material/menu";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {MatToolbarModule} from "@angular/material/toolbar";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSidenavModule,
        MatDialogModule,
        MatSelectModule,
        MatGridListModule,
        MatMenuModule,
        MatCheckboxModule,
        MatListModule,
        MatIconModule,
        MatCardModule,
        MatTabsModule,
        MatToolbarModule,
        BrowserAnimationsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ],
      declarations: [ CategoryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
