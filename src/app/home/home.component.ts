import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  categoriesList() {
    this.router.navigate(['category/user/' + this.userService.currentUser.id]);
  }

  userInfo($event) {
    $event.stopPropagation();
    this.router.navigate(['user/' + this.userService.currentUser.id + '/info']);
  }

}
