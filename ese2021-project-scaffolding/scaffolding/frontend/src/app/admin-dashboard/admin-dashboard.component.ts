import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';
import { PermissionService } from '../services/permission.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  loggedIn = false;
  currentUser : User = new User(0, '', '', false,'','','','','','','','','');

  constructor(
    public userService: UserService,
    private router: ActivatedRoute,
    private route: Router,
    private permissionSerivce: PermissionService
              ) { }

  ngOnInit(): void {
    // Listen for changes
    this.userService.loggedIn$.subscribe(res => this.loggedIn = res);
    this.userService.user$.subscribe(res => this.currentUser = res);

    // Current value
    this.loggedIn = this.userService.getLoggedIn();
    this.currentUser = this.userService.getUser();

    //reroute if user is not admin
    if(!this.permissionSerivce.checkPermissionToAccessAdminDashboard(this.loggedIn, this.currentUser)) {
      this.route.navigate(['/home']).then(r => {});
    }
  }



}
