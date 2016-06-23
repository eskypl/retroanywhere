const firebase = require('firebase');

import { enableProdMode } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';

import { AppComponent } from './app/app.component';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';

firebase.initializeApp({
  apiKey: "AIzaSyDvy_O9Gq7VqFr5mD4VG--aH0z_o_IRHuw",
  authDomain: "retroanywhere-dev.firebaseapp.com",
  databaseURL: "https://retroanywhere-dev.firebaseio.com"
});

firebase.auth().getRedirectResult().then(() => {
  let currentUser: any = firebase.auth().currentUser;
  if (currentUser) {
    enableProdMode();
    bootstrap(AppComponent, [
      APP_ROUTER_PROVIDERS
    ]).catch(err => console.error(err));
  } else {
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }
});
