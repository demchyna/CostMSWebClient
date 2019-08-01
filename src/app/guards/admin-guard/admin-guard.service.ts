import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {UserService} from '../../user/user.service';
import {AuthService} from '../../auth/auth.service';

@Injectable()
export class AdminGuardService implements CanActivate {

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {  }

  canActivate(): boolean {
    if (this.authService.isLoggedIn() && this.userService.isAdmin()) {
      return true;
    }
    this.router.navigate(['/no-access']);
    return false;
  }
}
