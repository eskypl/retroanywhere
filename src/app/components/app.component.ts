import {Component, OnInit, ChangeDetectorRef} from '@angular/core';

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
     <ret-bucket *ngFor="let bucket of buckets" [name]="bucket.name" [id]="bucket.id"></ret-bucket>
    </div>
  `
})
export class AppComponent {
  buckets = [];
  
  constructor(private fb: FirebaseService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.fb.ref('buckets').once('value').then((snapshot)=>{
      snapshot.forEach((child) => { 
        console.log();
        this.buckets.push({id: child.key, name: child.val().name});
      });
    });
  };
}