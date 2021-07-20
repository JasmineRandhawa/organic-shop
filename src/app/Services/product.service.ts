import { Injectable } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable()

/*--Product Service to get/save/update/delete product data from firebase database--*/
export class ProductService {

  /*---Inject angular fire database--*/
  constructor(private db: AngularFireDatabase) {

  }

  /*---get product from firebase database based on product's unique Id--*/
  get(productUId: string) : Observable<SnapshotAction<unknown>> {
    return this.db.object('/products/' + productUId)
                  .snapshotChanges()
  }

  /*---get all products from firebase database--*/
  getAll() : Observable<SnapshotAction<unknown>[]> {
    return this.db.list('products')
                  .snapshotChanges();
  }

  /*---save new product to firebase database--*/
  save(product: any) : string | null {
    let newKey = this.db.list('/products/')
                        .push(product).key;
    return newKey ? newKey : null;
  }

  /*---update existing product to firebase database based on product's unique Id--*/
  update(productUId:string, product: any) : Promise<boolean> {
    return this.db.object('/products/'+ productUId)
                  .update(product)
                  .then(()=>true)
                  .catch(()=>false);
  }

  /*---delete existing product from firebase database based on product's unique Id--*/
  delete(productKey: string) : Promise<boolean>  {
    return this.db.list('/products/'+productKey)
                  .remove()
                  .then(()=>true)
                  .catch(()=>false);
  }
}
