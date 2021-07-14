import { Observable, of } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/Services/product.service';
import { Product } from 'src/app/models/product';
import {  map } from 'rxjs/operators';
import { CategoryService } from 'src/app/Services/category.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent {

  products$ : Observable<Product[]> ;

  constructor(private productService:ProductService, private categoryService:CategoryService) { 
    this.products$ = this.productService.getAll().pipe(map(changes => {
                      return changes.map(
                        (
                          p: any) => ({ uId:  p.payload.key, 
                                        title:  p.payload.toJSON()['title'],
                                        price: Number( p.payload.toJSON()['price']),
                                        category:  p.payload.toJSON()['category'],
                                        imageURL:  p.payload.toJSON()['imageURL'] } as Product)
                      )
                    }));
  }

 async onDelete(product:Product)
  {
      if(confirm("Are you sure you want to delete product " + product.title + "?"))
      {
        if(product && product.uId)
        {
          let isDeleted  = await this.productService.delete(product.uId);
          if(isDeleted)
            alert("Product "+product.title +" deleted successfully" )
          else
            alert("Deletion failed!" )
        }
      }
  }
}
