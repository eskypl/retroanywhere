import {enableProdMode} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';

import {AppComponent} from './app/components/app.component';

declare var firebase: any;

firebase.initializeApp({
  apiKey: "AIzaSyDvy_O9Gq7VqFr5mD4VG--aH0z_o_IRHuw",
  authDomain: "retroanywhere-dev.firebaseapp.com",
  databaseURL: "https://retroanywhere-dev.firebaseio.com"
});

firebase.auth().getRedirectResult().then(() => {
  let currentUser: any = firebase.auth().currentUser;
  if (currentUser) {
    enableProdMode();
    bootstrap(AppComponent).catch(err => console.error(err));
  } else {
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }
});
