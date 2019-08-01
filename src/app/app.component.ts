import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {UserService} from './user/user.service';
import {BreadcrumbService} from 'ng5-breadcrumb';
import {MeterService} from './meter/meter.service';
import Meter from './models/Meter';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Cost Management System';

  navbarOpen = false;
  meter: Meter;

  constructor(private router: Router,
              public authService: AuthService,
              public userService: UserService,
              private meterService: MeterService,
              private cd: ChangeDetectorRef,
              private breadcrumbService: BreadcrumbService) {  }

  ngOnInit(): void {
    this.breadcrumbService.hideRoute('/');
    this.breadcrumbService.hideRouteRegex('/home$');
    this.breadcrumbService.hideRouteRegex('/user$');
    this.breadcrumbService.hideRouteRegex('/user/[0-9]+$');
    this.breadcrumbService.hideRouteRegex('/users/[0-9]+$');
    this.breadcrumbService.hideRouteRegex('/.*/category/[0-9]+$');
    this.breadcrumbService.hideRouteRegex('/.*/tariff/[0-9]+$');
    this.breadcrumbService.hideRouteRegex('/.*/[0-9]+/meter$');
    this.breadcrumbService.hideRouteRegex('/.*/meter$');
    this.breadcrumbService.hideRouteRegex('/.*/meter/[0-9]+$');
    this.breadcrumbService.hideRouteRegex('/.*/indicator/[0-9]+$');
    this.breadcrumbService.hideRouteRegex('/.*/funds/[0-9]+$');
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
