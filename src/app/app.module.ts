import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomFormsModule } from 'ng2-validation';
import { DataTableModule } from 'angular5-data-table';

import { AppComponent } from 'src/app/app.component';
import { components, routes, services } from 'src/app/app-module-lists';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: components ,
  
  imports: [
    BrowserModule,
    NgbModule,

    FormsModule,
    CustomFormsModule,
    ReactiveFormsModule ,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    DataTableModule,

    RouterModule.forRoot(routes)
  ],

  providers: services,

  bootstrap: [AppComponent]

})

export class AppModule { }
