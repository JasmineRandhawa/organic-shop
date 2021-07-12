import { AngularFireDatabase, DatabaseSnapshot, SnapshotAction } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../models/category';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private db :AngularFireDatabase) {
    
   }
   getCategories()
   {
    return this.db.list('categories').snapshotChanges();
   }
}
