import { Subscription } from 'rxjs';
import { ShoppingCartItem } from './models/shopping-cart-item';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService } from './services/shopping-cart.service';
import { AppUser } from './models/app-user';


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
  subscription: Subscription|undefined;

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

  ngOnInit(): void {
    this.subscription  = this.authService.appUser$.subscribe((user: AppUser | null) => {
      this.cartService.getAll().subscribe((cartsSnapshot: any) => {
        this.cartItemsCount = 0;
        cartsSnapshot.map((cartSnapshot: any) => {
          if (cartSnapshot.key) {
            let loggedInUser = cartSnapshot.payload.toJSON()['user'];
            if (user?.uId == loggedInUser['uId']) {
              let cartUId = localStorage.getItem('cartUId');
              if (!cartUId)
                localStorage.setItem('cartUId', cartSnapshot.key);
            }
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

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
