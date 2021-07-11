import { switchMap } from 'rxjs/operators';
import  firebase  from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFireDatabase  } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { AppUser } from '../models/app-user';

@Injectable()
export class UserService {
  constructor(private db : AngularFireDatabase)  {
    
   }

   getUser(uid:string)  : Observable<AppUser>
   {
    return  this.db.object('/users/' + uid).snapshotChanges().pipe(switchMap((userSnapshot :any) => {
        let user  = userSnapshot.payload.toJSON();
        console.log("User",user);
        return of({ uId: userSnapshot.key,
            name:user['name'] , 
            email:user['email'],
            isAdmin:user['isAdmin'] 
      });
    }));
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
