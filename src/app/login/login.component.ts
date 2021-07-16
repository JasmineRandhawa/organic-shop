import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  constructor(private authService: AuthService,private router:Router) {
   }

   login() {
    this.authService.login();
    if(this.authService.isAuthenticated)
      this.router.navigate(['/']);
  }
}
