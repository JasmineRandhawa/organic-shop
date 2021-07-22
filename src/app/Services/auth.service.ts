import { AppUser } from 'src/app/models/app-user';
import { UserService } from 'src/app/services/user.service';

import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth'
import firebase from 'firebase/app';

import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable()

/*---Auth Service for login and logout operations---*/
export class AuthService  {

  /*---Inject angular fire database , router and user service---*/
  constructor(private fireAuth: AngularFireAuth, private userService: UserService,
              private route: ActivatedRoute, private router: Router) {
  }

  /*---login and save user details from google sign to firebase database
    and also store in local storage the return url (if any) on login---*/
  login() : void {

    let returnURL = this.route.snapshot.queryParamMap.get('returnURL') ;
    if(returnURL && returnURL!=="/" && returnURL!=="/login")
      localStorage.setItem('returnURL', returnURL);

    this.fireAuth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
                 .then(()=>this.router.navigate(['/']));
  }

  /*---logout the user from application---*/
  logout() :void {
    localStorage.clear();
    this.fireAuth.signOut()
                 .then(()=> this.router.navigate(['/login']));
  }

  /*---get currently logged in user details---*/
  get appUser$() : Observable<AppUser|null>
  {
    return this.user$.pipe(switchMap((user)=>
    {
      if(user && user.uid) 
      {
        return this.userService.get(user.uid);
      }
      else
        return of(null);
    }));
  }

   /*---get currently logged in user details---*/
  get user$() : Observable<firebase.User|null|undefined>
  {
     return  this.fireAuth.authState;
  }

  /*---check if user is logged in---*/
  get isAuthenticated() : Observable<boolean>
  {
    return this.user$.pipe( map((user) => {
      if(user && user.uid)  return true;
      else return false;
    }));    
  }
}
