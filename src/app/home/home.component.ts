import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../user/user.service';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(public authService: AuthService, public userService: UserService, private router: Router) {  }

  fundsList() {
    this.router.navigate(['/user/' + this.userService.currentUser.id + '/funds']);
  }

  categoriesList() {
    this.router.navigate(['/user/' + this.userService.currentUser.id + '/category']);
  }

  usersList() {
    this.router.navigate(['/users']);
  }
}
