import { AppUser } from 'src/app/models/app-user';
import { UserService } from 'src/app/services/user.service';

import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth'
import firebase from 'firebase/app';

import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable()

/*---Auth Service for login and logout operations---*/
export class AuthService {

  user$;

  /*---Inject angular fire database , router and user service---*/
  constructor(private fireAuth: AngularFireAuth, private userService: UserService,
              private route: ActivatedRoute, private router: Router) {
    this.user$ = this.fireAuth.authState;
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
    this.fireAuth.signOut()
                 .then(()=> this.router.navigate(['/login']));
  }

  /*---check if user is logged in---*/
  get isAuthenticated() : Observable<boolean>
  {
    return this.user$.pipe( map((user) => {
      if(user && user.uid)  return true;
      else return false;
    }));    
  }

  /*---get currently logged in user details---*/
  get appUser$() : Observable<AppUser|null>
  {
    return this.fireAuth.authState.pipe(switchMap((firebaseUser:firebase.User | null )=>
    {
      if(firebaseUser && firebaseUser.uid) 
      {
        return this.userService.get(firebaseUser?.uid)
                               .pipe(
                                    switchMap((userSnapshot :any) => 
                                      of({ uId: userSnapshot.key,
                                          name:userSnapshot.payload.toJSON()['name'] , 
                                          email:userSnapshot.payload.toJSON()['email'],
                                          isAdmin:userSnapshot.payload.toJSON()['isAdmin'] 
                                          } as AppUser)
                                          ) 
                                  );
      }
      else
        return of(null);
    }));
  }
}
