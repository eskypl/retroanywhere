import {bootstrap} from '@angular/platform-browser-dynamic';

import {AppComponent} from './app/components/app.component';

declare var firebase: any;

firebase.initializeApp({
  apiKey: "AIzaSyDbraSHmsiOH0SCHy_NLaX6wIgXpc2CuAE",
  authDomain: "eskyid-retro-app.firebaseapp.com",
  databaseURL: "https://eskyid-retro-app.firebaseio.com"
});

firebase.auth().getRedirectResult().then(() => {
  let currentUser: any = firebase.auth().currentUser;
  if (currentUser) {
    bootstrap(AppComponent).catch(err => console.error(err));
  } else {
    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }
});
