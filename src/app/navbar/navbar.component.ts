import { AppUser } from 'src/app/models/app-user';
import { AuthService } from 'src/app/services/auth.service';

import { Component, Input} from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

/*---Navigation Bar Component---*/
export class NavbarComponent {

  /*----class property declarations----*/ 
  appUser: AppUser | undefined;
  @Input('cart-items-count') cartItemsCount:number|undefined ;

  /*----Inject auth service----*/ 
  constructor(private auth: AuthService) {

    //get logged in user from auth service
    this.auth.appUser$.subscribe((appUser) => 
    {
      this.appUser = appUser || undefined ;
      return this.appUser ;
    })

  }

  /*----logout from application----*/ 
  logout()
  {
    this.auth.logout();
  }
}
