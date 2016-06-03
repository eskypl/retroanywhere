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
    .ret-buckets {
      flex-grow: 1;
      display: flex;
      flex-direction: row;
    }
    .ret-buckets ret-bucket:nth-child(2n+0) {
      background: #1c2b39
    }
    .ret-buckets ret-bucket:nth-child(2n+1) {
      background: #203141;
    }
    .ret-header {
      padding: 1em 2.5em;
      background: #182531;    
      color:  #f6f7f8;
      font-size: 1.625em;
      font-weight: 700;      
    }
  `],
  template: `
    <header class="ret-header">
        <h1>eSky retrospective</h1>
    </header>
    <div class="ret-buckets">
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
        this.buckets.push({id: child.key, name: child.val().name});
      });

      this.ref.detectChanges();
    });
  };
}
