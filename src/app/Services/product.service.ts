import { AngularFireDatabase, SnapshotAction } from '@angular/fire/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFireDatabase) { }

  get(productUId: string) {
    return this.db.object('/products/' + productUId).snapshotChanges()
  }

  getAll() {
    return this.db.list('products').snapshotChanges();
  }

  save(product: any) {
    let newKey = this.db.list('/products/').push(product).key;
    return newKey ? newKey : null;
  }

  update(productUId:string, product: any) {
    return this.db.object('/products/'+ productUId).update(product)
    .then(()=>true).catch(()=>false);
  }

  delete(productKey: string)  {
    return this.db.list('/products/'+productKey).remove().then(()=>true).catch(()=>false);
  }
}
