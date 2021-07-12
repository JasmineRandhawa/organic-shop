import { map, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth'
import { Observable, of } from 'rxjs';
import { AppUser } from '../models/app-user';

@Injectable()
export class AuthService {
  user$;

  constructor(private fireAuth: AngularFireAuth, private userService: UserService,
     private route: ActivatedRoute, private router: Router) {
    this.user$ = this.fireAuth.authState;
  }

  login() {
    let returnURL = this.route.snapshot.queryParamMap.get('returnURL') ;
    console.log("return" ,returnURL);
    if(returnURL && returnURL!=="/" && returnURL!=="/login")
      localStorage.setItem('returnURL', returnURL);
    this.fireAuth.signInWithRedirect(new firebase.auth.GoogleAuthProvider()).then(()=>
    {
      this.router.navigate(['/']);
    });
  }

  logout() {
    this.fireAuth.signOut().then(()=> this.router.navigate(['/login']));
  }

  get isAuthenticated()
  {
    return this.user$.pipe( map((user) => {
      if(user && user.uid)  return true;
      else return false;
    }));    
  }

  get appUser$() : Observable<AppUser|null>
  {
    return this.fireAuth.authState.pipe(switchMap((firebaseUser:firebase.User | null )=>
    {
      if(firebaseUser && firebaseUser.uid) 
      {
        return this.userService.getUser(firebaseUser?.uid).pipe(switchMap((userSnapshot :any) => {
          let user  = userSnapshot.payload.toJSON();
          return of({ uId: userSnapshot.key,
              name:user['name'] , 
              email:user['email'],
              isAdmin:user['isAdmin'] 
          } as AppUser);
        }));;
      }
      else
        return of(null);
    }));
  }
}
