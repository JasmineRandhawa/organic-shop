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
  @Input('cart-items-count') cartItemsCount:number = 0;

  /*----Inject auth service----*/ 
  constructor(private auth: AuthService) {

    //get logged in user from auth service
    this.auth.appUser$.subscribe((appUser:AppUser|null) => 
                      {
                        if(appUser)
                        {
                          this.appUser = new AppUser(appUser.uId, appUser.name, appUser.email, appUser.isAdmin) ;
                        }
                      })
  }

  /*----logout from application----*/ 
  logout()
  {
    this.appUser = undefined;
    this.auth.logout();
  }
}
