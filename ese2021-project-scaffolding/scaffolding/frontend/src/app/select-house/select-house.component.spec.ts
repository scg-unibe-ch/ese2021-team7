import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectHouseComponent } from './select-house.component';

describe('SelectHouseComponent', () => {
  let component: SelectHouseComponent;
  let fixture: ComponentFixture<SelectHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectHouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
