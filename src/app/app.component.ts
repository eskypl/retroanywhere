import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { FirebaseService } from './shared/services/firebase/firebase.service';

@Component({
  selector: 'ra-app',
  providers: [ FirebaseService ],
  directives: [ ROUTER_DIRECTIVES ],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
