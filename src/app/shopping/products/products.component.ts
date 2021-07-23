import { CATEGORY_ALL } from 'src/app/utility/constants';
import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';

import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { compare } from 'src/app/utility/helper';

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
/*---Products list for adding to cart---*/
export class ProductsComponent implements OnInit, OnDestroy {

  /*---class property declarations---*/
  defaultCategory = CATEGORY_ALL
  @Input('category') category: string = this.defaultCategory;

  items: ShoppingCartItem[] = [];
  filteredItems: ShoppingCartItem[] = [];


  categorySubscription: Subscription;
  productSubscription: Subscription | undefined;
  cartSubscription: Subscription | undefined;
  
  /*---Initialize properties from firebase database---*/
  ngOnInit() {
   // get list of products and shopping cart items from firebase 
   this.productSubscription = this.productService
                                  .getAll()
                                  .subscribe((products) =>  {
                                    this.items =[];
                                    this.filteredItems =[];
                                    let cartUId = localStorage.getItem('cartUId') || "";
                                    products.map((product)=> { 
                                      this.cartSubscription = this.cartService
                                                                  .getItem(cartUId, product.productUId)
                                                                  .subscribe((item:any)=> {
                                                                    let cartItem = new ShoppingCartItem(product,0);
                                                                    if(item && item.product.productUId == product.productUId)
                                                                        cartItem = new ShoppingCartItem(product,item.quantity);
                                                                    this.items.push(cartItem);
                                                                    this.filteredItems.push(cartItem);
                                                                });

                                      });
                                  });     
  }

  /*---subscribe to query param---*/
  constructor(private productService: ProductService, private route: ActivatedRoute,
              private cartService: ShoppingCartService) {

      //whenever the url category filter param changes , filter the products
    this.categorySubscription = this.route
                                    .queryParamMap
                                    .subscribe(params => {
                                      this.category = params.get('category') || this.defaultCategory;
                                      this.filterProducts(this.category);
                                    });
  }

  /*---Check if any products are available---*/
  get isAnyItems()
  {
    return this.filteredItems.length > 0;
  }

  /*---Filter Products table on Search---*/
  filterProducts(categoryFilter : string) {
    if(categoryFilter === this.defaultCategory) 
      this.filteredItems = this.items;
    else
        this.filteredItems = this.items
                                    .filter((item) => 
                                      compare(item.product.category.categoryUId , categoryFilter));
  }

  /*---unsubscribe from services once component is destroyed---*/
  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
    this.productSubscription?.unsubscribe();
    this.categorySubscription?.unsubscribe();
  }
}