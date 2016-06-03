import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';

import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'ret-item',
  styles: [`
    :host {
      display: block;
      margin: 1.25rem 0 0 0;
      flex-basis: 16.875rem;
      min-height: 10rem;
      background: #2b465e;
      border-radius: 3px;
      overflow: hidden;
      color: #182531;
    }
    textarea {
      border: none;
      outline: none;
      box-sizing: border-box;
      width: 100%;
      overflow: hidden;
      background: transparent;
      color: #182531;
      padding: 2rem;
      font-family: 'Ubuntu', sans-serif;
      font-weight: bold;
    }
    .edited-by-section {
      padding: .625rem;
      min-height: 2.5rem;
      max-height: 2.5rem;
      line-height: 2.5rem;
      color: #182531;
      font-size: .875rem;
    }
    .edited-by-image {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      float: left;
      margin-right: .625rem;
    }
  `],
  template: `
    <div><button *ngIf="showUnvoteButton" (click)="removeVote()">MINUS</button> My votes: {{myVotes}} <button (click)="addVote()">PLUS</button></div>
    <textarea [ngModel]="text" (ngModelChange)="updateText($event)" (focus)="onFocus()" (blur)="onBlur()"></textarea>
    <div class="edited-by-section">
      <img class="edited-by-image" *ngIf="isEditedBy" [src]="isEditedBy.photoURL"/>
      <img *ngIf="isEditedBy" src="https://firebasestorage.googleapis.com/v0/b/eskyid-retro-app.appspot.com/o/img%2Ftyping.gif?alt=media&token=34999844-2023-4566-985d-08a8fa23e6dc" />
      {{isEditedBy?.name || 'nobody'}} is typing...
    </div>
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
