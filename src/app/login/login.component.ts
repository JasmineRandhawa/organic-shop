import { Router } from '@angular/router';
import { AuthService } from './../Services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  constructor(private authService: AuthService,private router:Router) {
   }

   login() {
    this.authService.login();
   }
}
