import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';

import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'ret-participant',
  styles: [`
    :host {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: 48px;
    }
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 16px;
    }
    .name {
      font-size: 14px;
      font-weight: 700;
      color: #969dac;
    }
    .votes {
      font-size: 18px;
      font-weight: 400;
      color: #f6f7f8;
    }
  `],
  template: `
    <img [src]="participant.photoURL"/>
    <div>
      <div class="name">{{participant.name}}</div>
      <div *ngIf="showVotes" class="votes">{{votes}} {{votesPostfix}}</div>
    </div>   
  `
})
export class ParticipantComponent {
  @Input() participant;
  votes: number;
  currentStepKey = "ADD_ITEMS";

  constructor(private fb: FirebaseService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.fb.ref(`votes/${this.participant.uid}`).on('value', (snapshot) => {
      this.votes = snapshot.val() || 0;
      this.ref.detectChanges();
    });

    this.fb.ref('step').on('value', (snapshot)=>{
      this.currentStepKey = snapshot.val();
      this.ref.detectChanges();
    });
  }

  get votesPostfix() {
    return this.votes === 1 ? 'vote' : 'votes';
  }

  get showVotes() {
    return this.currentStepKey === 'VOTE';
  }
}
