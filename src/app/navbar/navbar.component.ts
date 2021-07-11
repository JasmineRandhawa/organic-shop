import { AuthService } from './../Services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppUser } from '../models/app-user';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  appUser: AppUser | undefined;

  constructor(private  auth:AuthService) {
    this.auth.appUser$.subscribe((appUser) => 
    {
      this.appUser = appUser || undefined ;
      return this.appUser ;
    })
  }

  logout()
  {
    this.auth.logout();
  }
}
