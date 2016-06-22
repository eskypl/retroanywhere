import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {FirebaseService} from '../services/firebase.service';
import {StepsService} from '../services/steps.service';

import {ParticipantsComponent} from './participants.component';
import {BucketComponent} from './bucket.component';
import {ActionListComponent} from './action-list.component';
import {NavigationComponent} from './navigation.component';

@Component({
  providers: [StepsService],
  directives: [ParticipantsComponent, BucketComponent, ActionListComponent, NavigationComponent],
  styles: [`
    :host {
      height: 100%;
      min-width: 1920px;
      display: flex;
      flex-direction: column;
      
    }
    .ret-buckets {
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      z-index: 1;
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
    .ret-step {
      font-size: 1.25rem;
      font-weight: 400;
      line-height: 4.575rem;
      margin-bottom: -.2rem;
    }
    ret-participants {
      flex-grow: 1;
    }
  `],
  template: `
    <section class="{{stepClass}}">
      <header class="ret-header">
        <h1>eSky retrospective</h1>
        <span *ngIf="stepName" class="ret-step">&nbsp;&nbsp;-&nbsp;&nbsp;{{stepName}}</span>
        <ret-participants></ret-participants>
      </header>
  
      <div [ngClass]="{hidden: hideBuckets, 'ret-buckets': true}" >
        <ret-bucket *ngFor="let bucket of buckets"
          [name]="bucket.name"
          [color]="bucket.color"
          [icon]="bucket.icon"
          [id]="bucket.id">
        </ret-bucket>
      </div>
      <div [hidden]="currentStepKey !== 'ADD_ACTIONS'">
        <ret-action-list></ret-action-list>
      </div>
  
      <ret-navigation></ret-navigation>
    </section>
  `
})
export class RetroComponent {
  buckets = [];
  currentStepKey = this.steps.initialStep;

  constructor(
    private fb:FirebaseService,
    private steps:StepsService,
    private ref:ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.fb.initRetro(params['retroUid']).then(() => {
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

        this.steps.getActiveStep(snapshot => {
          this.currentStepKey = snapshot.val();
          this.ref.detectChanges();
        });
      });
    });
  };

  get stepName() {
    return this.steps.getStepName(this.currentStepKey);
  }

  get stepClass() {
    return Object.keys(this.steps.getSteps())
      .filter((key:any) => isNaN(key))
      .map(key => key === this.currentStepKey ? key : `not-${key}`)
      .join(' ');
  }

  get hideBuckets(){
    return this.currentStepKey === 'ADD_ACTIONS';
  }
}
