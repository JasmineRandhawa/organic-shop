import { Injectable } from '@angular/core';
import { AngularFireDatabase  } from '@angular/fire/database';
import  firebase  from 'firebase/app';
import { Observable } from 'rxjs';
import { AppUser } from '../models/app-user';

@Injectable()

/*--User Service to get or save user data from firebase database--*/
export class UserService {

  /*---Inject angular fire database--*/
  constructor(private db : AngularFireDatabase)  {
    
   }

  /*---get user from firebase database based on user unique Id--*/
  get(uId:string) : Observable<AppUser|null>
  {
    return this.db.object<AppUser>('/users/' + uId).valueChanges();
  }

  /*---save/update details of user logged in from google sign 
    into the firebase database based on user unique Id--*/
  save(user:firebase.User) : void
  {
    this.db.object('/users/' + user.uid).update(
    {
      name: user.displayName,
      email: user.email
    });
  }
   
}
