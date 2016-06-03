import {Component, OnInit, ChangeDetectorRef} from '@angular/core';

import {FirebaseService} from '../services/firebase.service';
import {ParticipantComponent} from './participant.component';

@Component({
  selector: 'ret-participants',
  directives: [ParticipantComponent],
  styles: [`
    :host {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  `],
  template: `
    <ret-participant *ngFor="let participant of participants" [participant]="participant"></ret-participant>
  `
})
export class ParticipantsComponent {
  participants = [];

  constructor(private fb: FirebaseService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.fb.ref('participants').on('child_added', (snapshot) => {
      this.participants.push({
        uid: snapshot.key,
        name: snapshot.val().name,
        photoURL: snapshot.val().photoURL
      });
      this.ref.detectChanges();
    });
  }
}
