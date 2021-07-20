
import { Product } from 'src/app/models/product';
import { CATEGORY_ALL } from 'src/app/constants';

import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

import { compare , isEmpty } from 'src/app/utility/helper';

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
/* Products list for adding to cart */

export class ProductsComponent implements OnInit , OnDestroy{

   /*----property declarations----*/ 
   products$: Observable<Product[]> | undefined;
   products: Product[] | undefined;
   defaultCategory = CATEGORY_ALL
   @Input('category') category:string = this.defaultCategory;
   categorySubscription :Subscription;

    /*----Initialize properties from firebase database----*/ 
    ngOnInit() 
    { 
      // get list of products from firebase to populate the table
      this.products$ = this.productService.getAll().pipe(map(changes => {
                        this.products = [];

                        return changes.map((p: any) => {
                            let product = {
                              uId: p.payload.key,
                              title: p.payload.toJSON()['title'],
                              price: Number(p.payload.toJSON()['price']),
                              category: p.payload.toJSON()['category'],
                              imageURL: p.payload.toJSON()['imageURL']
                            } as Product

                            this.products?.push(product);
                            return (product);
                          }
                        )
                    }));
  }

  /*----subscribe to query param----*/ 
  constructor(private productService: ProductService,private categoryService: CategoryService, 
              private route:ActivatedRoute , private cartService:ShoppingCartService) 
  {
    //whenever the url category filter param changes , filter the products
    this.categorySubscription = this.route.queryParamMap.subscribe(params=>
                        {
                          this.category = (!isEmpty(params.get('category')) ? params.get('category') 
                                                   : this.defaultCategory) || this.defaultCategory
                          this.filterProducts(this.category);
                        });
  }


  /*----Filter Products table on Search----*/ 
  filterProducts(categoryFilter: string) 
  {
    let filteredProducts:Product[] = this.products ? this.products:[];
    if(this.products && categoryFilter != this.defaultCategory)
    {     
      if(!isEmpty(categoryFilter))
        filteredProducts = this.products.filter((product)=>  compare(product.category.uId , categoryFilter));
    }
    this.products$ = of(filteredProducts);
  }

  /*----unsubscribe from product service on component destruction----*/ 
  ngOnDestroy(): void {
    this.categorySubscription?.unsubscribe();
  }
}
