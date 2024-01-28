import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage-angular';
import { initializeApp } from 'firebase/app';

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlf9Thn2czOWzt8Tkj_bh38osUUki5Fv8",
  authDomain: "shoppingapp-2987f.firebaseapp.com",
  projectId: "shoppingapp-2987f",
  storageBucket: "shoppingapp-2987f.appspot.com",
  messagingSenderId: "290070546149",
  appId: "1:290070546149:web:826ca0ead59e6a7695360c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot()],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})

export class AppModule {}