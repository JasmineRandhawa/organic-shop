import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
}) 

/* Main Parent component of application */
export class AppComponent {
  title = 'organic-shop';

  /* Contructor invoked on loading all appliaction components */
  constructor(private userService: UserService, private auth: AuthService, private router: Router) {

    /* navigating user to return url if user is logged in*/
    this.auth.user$.subscribe((user) => {

      if (user && user.uid) {

        /* save user details (in case details updated) to firebase db 
           as we dont have explicit register user form*/
        this.userService.save(user);

        /* extract return url from local storage*/
        let returnURL = localStorage.getItem('returnURL');

        //clear the return url after extration
        localStorage.clear();

        //navigate user to return url
        if (returnURL && returnURL !== '/' && returnURL !== '/login')
          this.router.navigateByUrl(returnURL);
      }
    }
    );
  }
}
