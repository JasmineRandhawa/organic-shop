import { AuthService } from 'src/app/services/auth.service';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import firebase from 'firebase/app';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()

/*---Auth Guard Service for checking if user is logged in 
  and can access to the pages the auth guard is applied on---*/
export class AuthGuardService implements CanActivate {

  /*---Inject router and auth service---*/
  constructor(private auth: AuthService, private router: Router) {

  }

  /*---check if user can access the page the auth guard is applied on---*/
  canActivate(route :ActivatedRouteSnapshot, 
              state : RouterStateSnapshot) : Observable<boolean> {

    return  this.auth.user$
                .pipe(map((user: firebase.User | null |undefined) => {
                  // if user is logged in , user can access the requested page
                  if(user && user.uid) return true;
                  
                  //else user is redirected to the login page
                  this.router.navigate(['/login'], 
                                      { queryParams: { returnURL: state.url}});
                  return  false;
                })); 
  }
}
