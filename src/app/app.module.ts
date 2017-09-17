import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';


import { MdToolbarModule } from '@angular/material';
import { MdAutocompleteModule } from '@angular/material';
import { MdInputModule } from '@angular/material';
import { MdCheckboxModule } from '@angular/material';
import { MdSelectModule } from '@angular/material';
import { MdCardModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';
import { MdTableModule } from '@angular/material';

import { AppComponent } from './app.component';
import { LandingComponent } from '../components/landing';
import { DashboardComponent } from '../components/dashboard';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdToolbarModule,
    MdAutocompleteModule,
    MdInputModule,
    MdCheckboxModule,
    MdSelectModule,
    MdCardModule,
    MdButtonModule,
    MdTableModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forRoot([{
      path: 'landing',
      component: LandingComponent
    }, {
      path: 'dashboard/:courseId',
      component: DashboardComponent
    }, {
      path: '',
      redirectTo: '/landing',
      pathMatch: 'full'
    }])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
