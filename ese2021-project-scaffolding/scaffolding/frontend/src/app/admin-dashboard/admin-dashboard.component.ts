import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  loggedIn = false;
  user: User | undefined;

  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router
              ) { }

  ngOnInit(): void {
    // Listen for changes
    this.userService.loggedIn$.subscribe(res => this.loggedIn = res);
    this.userService.user$.subscribe(res => this.user = res);

    // Current value
    this.loggedIn = this.userService.getLoggedIn();
    this.user = this.userService.getUser();

    //reroute if user is not admin
    this.checkPermissionToAccess();
  }

  /**
   * Checks if user is admin, otherwise re-routes.
   */
  checkPermissionToAccess(): void {
    if(!this.user.isAdmin){
      this.router.navigate(['/feed']).then(r => {});
    }
  }

}
