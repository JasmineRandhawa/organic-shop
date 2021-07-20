import { ShoppingCartItem } from './../models/shopping-cart-item';

import { Product } from 'src/app/models/product';
import { CATEGORY_ALL } from 'src/app/constants';

import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

import { compare, isEmpty } from 'src/app/utility/helper';

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
/* Products list for adding to cart */

export class ProductsComponent implements OnInit, OnDestroy {

  /*----property declarations----*/
  products: Product[] | undefined;
  filteredProducts: Product[] | undefined;
  defaultCategory = CATEGORY_ALL
  @Input('category') category: string = this.defaultCategory;
  categorySubscription: Subscription;
  productSubscription: Subscription | undefined;
  cartSubscription: Subscription | undefined;
  cartItems: ShoppingCartItem[] | undefined;

  /*----Initialize properties from firebase database----*/
  ngOnInit() {
    // get list of products from firebase to populate the table
    this.productSubscription = this.productService.getAll()
      .subscribe(changes => {
        this.products = [];
        this.filteredProducts = [];
        this.cartItems = [];
        changes.map((p: any) => {
          let product = {
            uId: p.payload.key,
            title: p.payload.toJSON()['title'],
            price: Number(p.payload.toJSON()['price']),
            category: p.payload.toJSON()['category'],
            imageURL: p.payload.toJSON()['imageURL']
          };

          this.products?.push(product);
          this.filteredProducts?.push(product);
          let item$ = this.getCartItem(product.uId || "")
          let cartItem = { product: product, quantity: 0 } as ShoppingCartItem
          this.cartSubscription = item$?.subscribe((item) => {
            if (item) {
              cartItem.quantity = item.quantity;
              this.cartItems?.push(cartItem);
            }
          });
        }
        )
      });
  }

  /*----subscribe to query param----*/
  constructor(private productService: ProductService, private route: ActivatedRoute,
    private cartService: ShoppingCartService) {
    //whenever the url category filter param changes , filter the products
    this.categorySubscription = this.route.queryParamMap.subscribe(params => {
      this.category = (!isEmpty(params.get('category')) ? params.get('category')
        : this.defaultCategory) || this.defaultCategory
      this.filterProducts(this.category);
    });
  }

  getCartItem(productUId: string) {
    let cartUId = localStorage.getItem('cartUId');

    if (cartUId && productUId)
      return this.cartService.getCartItem(cartUId, productUId)
        .pipe(map((itemSnapshot: any) => {
          if (itemSnapshot.payload.toJSON()) {
            let cartItem = {
              product: itemSnapshot.payload.toJSON()['product'],
              quantity: Number(itemSnapshot.payload.toJSON()['quantity'])
            } as ShoppingCartItem;
            return cartItem;
          }
          return undefined;
        }));
    return undefined;
  }

  getItem(productUId: string | undefined) {
    if (this.cartItems && productUId) {
      let item = this.cartItems?.filter((item) => item.product.uId == productUId)[0];
      if (item) return item.quantity; else undefined;
    }
    return undefined;
  }

  /*----Filter Products table on Search----*/
  filterProducts(categoryFilter: string) {
    this.filteredProducts = this.products ? this.products : [];
    if (this.products) {
      if (categoryFilter != this.defaultCategory) {
        if (!isEmpty(categoryFilter))
          this.filteredProducts = this.products
                                      .filter((product) => compare(product.category.uId, categoryFilter));
      }
      else {
        this.filteredProducts = this.products;
      }
    }
  }

  /*----unsubscribe from product category service on component destruction----*/
  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
    this.productSubscription?.unsubscribe();
    this.categorySubscription?.unsubscribe();
  }
}
