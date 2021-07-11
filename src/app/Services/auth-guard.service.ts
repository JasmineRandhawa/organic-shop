import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {
   
  }

  canActivate(route :ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return   this.auth.user$.pipe(map((user: firebase.User | null) => {
      console.log("User", user?.uid);
      if(user && user.uid) 
        return true;
      this.router.navigate(['/login'], { queryParams: { returnURL: state.url}});
      return  false;
    })); 

  }
}
