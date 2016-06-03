import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';

import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'ret-item',
  styles: [`
    :host {
      display: inline-block;
      margin: 1.25em 1.25em 0 0;
      background: #ffff8d;
      border-radius: 3px;
    }
    textarea {
      border: none;
      outline: none;
      background: transparent;
      color: #182531;
      padding: 2em;
      font-family: 'Ubuntu', sans-serif;
      font-weight: bold;
    }
    .edited-by-section {
      height: 60px;
    }
    .edited-by-image {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  `],
  template: `
    <div><button *ngIf="showUnvoteButton" (click)="removeVote()">MINUS</button> My votes: {{myVotes}} <button (click)="addVote()">PLUS</button></div>
    <textarea [ngModel]="text" (ngModelChange)="updateText($event)" (focus)="onFocus()" (blur)="onBlur()"></textarea>
    <div class="edited-by-section">Edited by: <img class="edited-by-image" *ngIf="isEditedBy" [src]="isEditedBy.photoURL"/> {{isEditedBy?.name || 'Nobody'}}</div>
  `
})
export class ItemComponent {
  @Input() uid;
  text: string;
  isEditedBy = null;
  myVotes;

  constructor(private fb: FirebaseService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.fb.ref(`items/${this.uid}/text`).on('value', (snapshot) => {
      this.text = snapshot.val();
      this.ref.detectChanges();
    });

    this.fb.ref(`items/${this.uid}/isEditedBy`).on('value', (snapshot) => {
      this.isEditedBy = snapshot.val();
      this.ref.detectChanges();
    });

    this.fb.ref(`items/${this.uid}/votes/${this.fb.currentUser.uid}`).on('value', (snapshot) => {
      this.myVotes = snapshot.val();
      this.ref.detectChanges();
    });
  }

  updateText(text: string) {
    this.fb.ref(`items/${this.uid}/text`).set(text);
  }

  onFocus() {
    let currentUser = this.fb.currentUser;

    this.fb.ref(`items/${this.uid}/isEditedBy`).set({
      name: currentUser.displayName,
      photoURL: currentUser.photoURL
    });
  }

  onBlur() {
    this.fb.ref(`items/${this.uid}/isEditedBy`).set(null);
  }

  addVote() {
    let userUid = this.fb.currentUser.uid;
    this.fb.ref(`items/${this.uid}/votes`).transaction((votes) => {
      if(!votes[userUid]) {
        votes[userUid] = 1;
      } else {
        votes[userUid] += 1;
      }
      return votes;
    });
  }

  removeVote() {
    let userUid = this.fb.currentUser.uid;
    this.fb.ref(`items/${this.uid}/votes`).transaction((votes) => {
      if (votes[userUid] >= 1) {
        votes[userUid] -= 1;
      }
      return votes;
    });
  }

  get showUnvoteButton() {
    return this.myVotes > 0;
  }
}
