import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';;
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AppUser } from '../models/app-user';
import { Observable, of } from 'rxjs';

@Injectable()
export class AdminAuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private auth: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.appUser$.pipe(
      map((user: AppUser | null | undefined) => {
        if (user && user.isAdmin) 
        {
          console.log(user);
          return true
        };
        console.log("not admin");
        this.router.navigate(['/not-admin'], { queryParams: { returnURL: state.url } });
        return false;
      })
    );
  }
}
