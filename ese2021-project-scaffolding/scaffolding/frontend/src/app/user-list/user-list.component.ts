import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent extends BaseComponent implements OnInit {

  constructor(public injector: Injector) { super(injector);}

  ngOnInit(): void {
  }

}
