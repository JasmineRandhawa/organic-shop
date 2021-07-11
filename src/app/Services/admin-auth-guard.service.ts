import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';;
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AppUser } from '../models/app-user';
import { Observable, of } from 'rxjs';

@Injectable()
export class AdminAuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private auth: AuthService) {
  }

  canActivate() : Observable<boolean> {
    return this.authService.appUser$.pipe(
      map((user:AppUser|null|undefined)=> user && user.isAdmin ? user.isAdmin : false )
    );
  }
}
