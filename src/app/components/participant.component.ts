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
    :host-context(.not-VOTE) .votes {
      display: none;
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
      <div class="votes">{{votes}} {{votesPostfix}}</div>
    </div>   
  `
})
export class ParticipantComponent {
  @Input() participant;
  votes: number;

  constructor(private fb: FirebaseService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.fb.ref(`votes/${this.participant.uid}`).on('value', (snapshot) => {
      this.votes = snapshot.val() || 0;
      this.ref.detectChanges();
    });
  }

  get votesPostfix() {
    return this.votes === 1 ? 'vote' : 'votes';
  }
}
