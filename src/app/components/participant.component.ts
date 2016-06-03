import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';

import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'ret-participant',
  styles: [`
    :host {
      display: inline-block;
      border: 1px solid black;
      padding: 4px;
      margin-left: 4px;
    }
  `],
  template: `
    <img [src]="participant.photoURL"/>
    <div>{{participant.name}}</div>
    <div>{{votes}}</div>
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
}
