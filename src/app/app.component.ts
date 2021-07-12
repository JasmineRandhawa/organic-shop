import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './Services/auth.service';
import { UserService } from './Services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'organic-shop';

  constructor(private userService: UserService, private auth: AuthService, private router: Router) {
    this.auth.user$.subscribe((user) => {
      if (user && user.uid) {
        this.userService.save(user);// save user details in firebase db
        let returnURL = localStorage.getItem('returnURL');
        localStorage.clear();
        if (returnURL && returnURL !== '/' && returnURL !== '/login')
          this.router.navigateByUrl(returnURL);
      }
    }
    );
  }
}
