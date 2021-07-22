import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';
import { Product } from 'src/app/models/product';
import { CATEGORY_ALL } from 'src/app/constants';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { compare, getCartIdFromLocalStorage, isEmpty } from 'src/app/utility/helper';

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
/* Products list for adding to cart */
export class ProductsComponent implements OnInit, OnDestroy {

  /*----property declarations----*/
  defaultCategory = CATEGORY_ALL
  @Input('category') category: string = this.defaultCategory;

  products: Product[] = [];
  filteredProducts: Product[] = [];

  cart:ShoppingCart = new ShoppingCart([]);
  cartIdFormLocalStorage:string = getCartIdFromLocalStorage();

  categorySubscription: Subscription;
  productSubscription: Subscription | undefined;
  cartSubscription: Subscription | undefined;


  /*----Initialize properties from firebase database----*/
  ngOnInit() {

    // get list of products from firebase to populate the table
    this.productSubscription = this.productService
                                   .getAll()
                                   .subscribe((products) => {
                                    this.products = [];
                                    this.filteredProducts = [];

                                    products.map((product:Product)=>
                                    {
                                      this.products.push(product);
                                      this.filteredProducts.push(product);
                                    })
                                  });

    // get list of shopping cart Items from firebase to populate the table
    if (!isEmpty(this.cartIdFormLocalStorage))
      this.cartSubscription = this.cartService.getCart(this.cartIdFormLocalStorage)
                                              .subscribe((cart: ShoppingCart | null) => {
                                                if (cart) {
                                                  this.cart = new ShoppingCart( [] , cart.uId,
                                                                                cart.user,
                                                                                cart.dateCreated)
                                                  for(let item in cart.items)                                             
                                                    this.cart.items.push(cart.items[item]);         
                                                }
                                              });
  }

  /*----subscribe to query param----*/
  constructor(private productService: ProductService, private route: ActivatedRoute,
              private cartService: ShoppingCartService) {

      //whenever the url category filter param changes , filter the products
      this.categorySubscription = this.route.queryParamMap
                                            .subscribe(params => {
                                              this.category = params.get('category') || this.defaultCategory;
                                              this.filterProducts(this.category);
                                            });
  }

  get isAnyProducts()
  {
    console.log(this.filteredProducts.length > 0);
    return this.filteredProducts.length > 0;
  }

   /*----get cart item containign the product from firebase ----*/
  getCartItem(product:Product) {
    if(this.cart.items.length>0)
    {    
      let item = this.cart.items.filter((item) => item.product.uId === product.uId)[0];
      if(item)
        return new ShoppingCartItem(product,item.quantity);
    }
    return new ShoppingCartItem(product,0);
  }

  /*----Filter Products table on Search----*/
  filterProducts(categoryFilter: string) {
    if (this.products.length>0) {
      if (categoryFilter != this.defaultCategory) {
        if (!isEmpty(categoryFilter))
          this.filteredProducts = this.products
                                      .filter((product) => compare(product.category.uId, categoryFilter));
      }
      else 
        this.filteredProducts = this.products;
    }
  }

  /*----unsubscribe from product category service on component destruction----*/
  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
    this.productSubscription?.unsubscribe();
    this.categorySubscription?.unsubscribe();
  }
}