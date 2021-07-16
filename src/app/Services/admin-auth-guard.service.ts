import { AppUser } from 'src/app/models/app-user';
import { AuthService } from 'src/app/services/auth.service';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';;

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()

/*---Auth Admin Guard Service for checking if user is an admin user 
  and can access to the pages the admin guard is applied on---*/
export class AdminAuthGuardService implements CanActivate {

  /*---Inject router and auth service---*/
  constructor(private auth: AuthService, private router: Router) {
  }

  /*---check if user can access the page the admin guard is applied on---*/
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.auth.appUser$.pipe(map((user: AppUser | null | undefined) => {

        // if current logged in user is an admin user then user can access the requested page
        if (user && user.isAdmin) return true;

        //else user is redirected to the not-admin page to inform user of no-access
        this.router.navigate(['/not-admin'], { queryParams: { returnURL: state.url } });
        return false;
      })
    );
  }
}
