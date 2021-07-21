import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';
import { Product } from 'src/app/models/product';
import { CATEGORY_ALL } from 'src/app/constants';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { compare, isEmpty } from 'src/app/utility/helper';

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

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
    this.productSubscription = this.productService
                                   .getAll()
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
                                        //populate products list
                                        this.products?.push(product);
                                        this.filteredProducts?.push(product);
                                      })
                                  });

    // get list of shopping cart Items from firebase to populate the table
    let cartUId = localStorage.getItem('cartUId') || "";
    if (!isEmpty(cartUId))
      this.cartSubscription = this.cartService
                                  .getCart(cartUId)
                                  .subscribe((cartSnapshot: any) => {
                                    this.cartItems = [];

                                    if (cartSnapshot.key) {
                                      let itemsArray = cartSnapshot.payload
                                                                    .toJSON()['items'] as ShoppingCartItem[];
                                      for (let item in itemsArray) {
                                        let cartItem = itemsArray[item] as ShoppingCartItem;
                                        if( cartItem.product.price)
                                        this.cartItems?.push({ product: cartItem.product,
                                                                quantity: cartItem.quantity });
                                      }
                                    }
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

   /*----get cart item containign the product from firebase ----*/
  getCartItemContainingProduct(productUId: string | undefined) {
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
