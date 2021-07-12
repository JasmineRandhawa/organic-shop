import  firebase  from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFireDatabase  } from '@angular/fire/database';


@Injectable()
export class UserService {
  constructor(private db : AngularFireDatabase)  {
    
   }

   getUser(uid:string) 
   {
     return  this.db.object('/users/' + uid).snapshotChanges();
   }

   save(user:firebase.User)
   {
     this.db.object('/users/' + user.uid).update(
     {
        name: user.displayName,
        email: user.email
     });
   }
   
}
