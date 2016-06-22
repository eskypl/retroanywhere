import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {FirebaseService} from './services/firebase.service';

@Component({
  selector: 'ret-app',
  providers: [FirebaseService],
  directives: [ROUTER_DIRECTIVES],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
