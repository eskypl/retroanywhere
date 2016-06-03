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
      display: flex;
      flex-direction: row;
      padding: 1rem 2.5rem;
      background: #182531;    
      color:  #f6f7f8;
      font-size: 1.625rem;
      font-weight: 700;      
    }
    .ret-header h1 {
      padding: 0 0 0 5rem;
      line-height: 4.375rem;
      font-weight: 700;
      background: transparent url('https://firebasestorage.googleapis.com/v0/b/eskyid-retro-app.appspot.com/o/img%2Flogo.png?alt=media&token=3fdf1c57-b7d5-4141-a92b-476578936495') no-repeat;
    }
    ret-participants {
      flex-grow: 1;
    }
  `],
  template: `
    <header class="ret-header">
      <h1>eSky retrospective</h1>
      <ret-participants></ret-participants>
    </header>
    <div class="ret-buckets">
      <ret-bucket *ngFor="let bucket of buckets" 
        [name]="bucket.name" 
        [color]="bucket.color" 
        [icon]="bucket.icon" 
        [id]="bucket.id">
      </ret-bucket>
    </div>
  `
})
export class AppComponent {
  buckets = [];

  constructor(private fb: FirebaseService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.fb.ref('buckets').once('value').then((snapshot)=>{
      snapshot.forEach((child) => {
        let {name, color, icon} = child.val();
        this.buckets.push({
          id: child.key,
          name, color, icon
        });
      });

      this.ref.detectChanges();
    });
  };
}
