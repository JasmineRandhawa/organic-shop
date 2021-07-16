import { Injectable } from '@angular/core';
import { AngularFireDatabase, DatabaseSnapshot, SnapshotAction } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable()

/*--Product Category Service to get category data from firebase database--*/
export class CategoryService {

  /*---Inject angular fire database--*/
  constructor(private db :AngularFireDatabase) {
    
  }

  /*---get all product categories from firebase database--*/
  getAll() : Observable<SnapshotAction<unknown>[]>
  {
    return this.db.list('categories').snapshotChanges();
  }
}
