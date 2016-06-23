import { Component } from '@angular/core';

import { FirebaseService } from '../../../shared/services/firebase/firebase.service';

@Component({
  selector: 'ra-my-mail',
  styles: [`
    .email {
    display: inline-block;
      cursor: pointer;
      color: #a06060;
      border: 2px solid #ffffff;
      border-radius: 8px;
      padding: 4px;
      transition: transform 1s cubic-bezier(0.68, -0.55, 0.265, 1.55), box-shadow 1s ease;
    }
    .email:hover {
      transform: scale(1.2) rotate(-3deg);
      border-color: #ffa000;
      background-color: #ffffd0;
      box-shadow: 3px 3px 3px 0px #cccccc;
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
