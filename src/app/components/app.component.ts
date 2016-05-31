import {Component} from '@angular/core';

import {FirebaseService} from '../services/firebase.service';
import {MyMailComponent} from './my-mail.component';

@Component({
  selector: 'ret-app',
  providers: [FirebaseService],
  directives: [MyMailComponent],
  template: `
    <h1>Retro App Starter</h1>
    <ret-my-mail></ret-my-mail>
  `
})
export class AppComponent {}
