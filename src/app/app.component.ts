import { AppUser } from './models/app-user';
import { ShoppingCartItem } from './models/shopping-cart-item';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ShoppingCartService } from './services/shopping-cart.service';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/* Main Parent component of application */
export class AppComponent implements OnInit,OnDestroy {
  title = 'organic-shop';
  items: any[] | undefined;
  cartItemsCount: number | undefined;
  cartSubscription: Subscription|undefined;

  /*---Get shopping cart count for nav bar display---*/
  ngOnInit(): void {
    this.cartSubscription  = this.authService.appUser$.subscribe((user: AppUser | null) => {

                              //get all shopping carts from firebase
                              this.cartService.getAll().subscribe((cartsSnapshot: any) => {

                                this.cartItemsCount = 0;

                                cartsSnapshot.map((cartSnapshot: any) => {
                                  if (cartSnapshot.key) {

                                    //get user from the cart
                                    let loggedInUser = cartSnapshot.payload.toJSON()['user'];

                                    //match the user against the logged in user and extract that cartId and save in local storage
                                    if (user?.uId == loggedInUser['uId']) {
                                      let cartUId = localStorage.getItem('cartUId');
                                      if (!cartUId)
                                        localStorage.setItem('cartUId', cartSnapshot.key);
                                    }

                                    //get items in extracted cart and compute total items count
                                    let itemsArray = cartSnapshot.payload.toJSON()['items'] as ShoppingCartItem[];
                                    for (let item in itemsArray) {
                                      let cartItem = itemsArray[item] as ShoppingCartItem;
                                      if (!this.cartItemsCount)
                                        this.cartItemsCount = 0;
                                      this.cartItemsCount += cartItem.quantity;
                                    }
                                  }
                                });
                              });
                            });
  }

  /* Contructor invoked on loading all appliaction components */
  constructor(private userService: UserService, private authService: AuthService,
    private router: Router, private cartService: ShoppingCartService) {

    /* navigating user to return url if user is logged in*/
    this.authService.user$.subscribe((user) => {

      if (user && user.uid) {

        /* save user details (in case details updated) to firebase db 
            as we dont have explicit register user form*/
        this.userService.save(user);

        /* extract return url from local storage*/
        let returnURL = localStorage.getItem('returnURL');

        //clear the return url after extration
        localStorage.removeItem('returnURL');
        //navigate user to return url
        if (returnURL && returnURL !== '/' && returnURL !== '/login')
          this.router.navigateByUrl(returnURL);
      }
    });
  }

  /*--Unsunscribe from the cart service on component destruction--*/
  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

}
