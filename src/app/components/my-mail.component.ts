import {Component} from '@angular/core';
import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'ret-my-mail',
  styles: [`
    .email {
      color: #a06060;
    }
  `],
  template: `
    <h2>I'm logged in as: <span class="email">{{email}}</span></h2>
  `
})
export class MyMailComponent {
  constructor(private fb: FirebaseService) {}

  get email() {
    return this.fb.currentUser.email;
  }
}
