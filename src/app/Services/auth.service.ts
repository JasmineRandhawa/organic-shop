import { switchMap } from 'rxjs/operators';
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
    console.log("logging");
    let returnURL = this.route.snapshot.queryParamMap.get('returnURL') || '/';
    localStorage.setItem('returnURL', returnURL);
    this.fireAuth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.fireAuth.signOut().then(()=> this.router.navigate(['/login']));
  }

  get appUser$() : Observable<AppUser|null>
  {
    return this.fireAuth.authState.pipe(switchMap((firebaseUser:firebase.User | null )=>
    {
      if(firebaseUser && firebaseUser.uid) 
      {
        //console.log("uid",firebaseUser.uid);
        //console.log("user",this.userService.getUser(firebaseUser?.uid));
        return this.userService.getUser(firebaseUser?.uid);
      }
      else
        return of(null);
    }));
  }
}
