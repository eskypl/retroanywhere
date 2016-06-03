import {Component} from '@angular/core';

import {FirebaseService} from '../services/firebase.service';
import {ParticipantsComponent} from './participants.component';
import {BucketComponent} from './bucket.component';

@Component({
  selector: 'ret-app',
  providers: [FirebaseService],
  directives: [ParticipantsComponent, BucketComponent],
  styles: [`
    :host {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .buckets-container {
      flex-grow: 1;
      border: 1px solid black;
      display: flex;
      flex-flow: column wrap;
    }
  `],
  template: `
    <ret-participants></ret-participants>
    <div class="buckets-container">
      <ret-bucket name="Start"></ret-bucket>
      <ret-bucket name="Continue"></ret-bucket>
      <ret-bucket name="Stop"></ret-bucket>
    </div>
  `
})
export class AppComponent {}
