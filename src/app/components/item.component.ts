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
    .edited-by-icon {
      position: relative;
      top: 6px;
      left: 3px;
    }
    .edited-by-image {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      float: left;
      margin-right: .625rem;
    }
    .ret-item-voting {
      visibility: hidden;
      min-height: 2.875rem;
      max-height: 2.875rem;
      line-height: 2.875rem;
      background-color: rgba(0,0,0,0.05);
      position: relative;
    }
    .ret-item-voting.has-votes {
      visibility: visible;
    }
    .ret-vote-actions {
      visibility: hidden;
    }
    :host(:hover) .ret-item-voting {
      visibility: visible;
    }
    :host(:hover) .ret-vote-actions {
      visibility: visible;
    }
    .ret-vote-actions button {
      background: transparent;
      border: 0;
      padding: 0;
      margin: 0 0 0 .5rem;
      max-height: 1.625rem;
    }
    .ret-vote-actions .icon {
      display: inline-block;
      border-radius: 50%;
      background-color: #fff;
      color: #1c2b39;
      font-size: 1.625rem;
    }
    .ret-vote-count {
      margin-left: 1rem;
      font-size: 1.375rem;
      font-weight: bold;
    }
    .ret-vote-count .sufix {
      font-weight: 400;
      font-size: .875rem;
    }
    .ret-item-voting:not(.has-votes) .ret-vote-count {
      opacity: .2;
    }
    .ret-vote-actions {
      position: absolute;
      top: .425rem;
      right: 1rem;
      max-height: 1.625rem;
    }
  `],
  template: `
    <div *ngIf="showItemVoting" [ngClass]="{'ret-item-voting': true, 'has-votes': showVotes}">
        <span class="ret-vote-count">{{votesCount}} <span class="sufix">votes</span></span>
        <div class="ret-vote-actions">
            <button *ngIf="showUnvoteButton" (click)="removeVote()"><span class="icon icon-minus_2"></span></button> 
            <button (click)="addVote()"><span class="icon icon-plus_2"></span></button>
        </div>
    </div>
    <textarea [ngModel]="text" (ngModelChange)="updateText($event)" (focus)="onFocus()" (blur)="onBlur()"></textarea>
    <div class="edited-by-section">
      <img class="edited-by-image" *ngIf="isEditedBy" [src]="isEditedBy.photoURL"/>
      {{isEditedBy?.name}}
      <img class="edited-by-icon" *ngIf="isEditedBy" src="https://firebasestorage.googleapis.com/v0/b/eskyid-retro-app.appspot.com/o/img%2Ftyping.gif?alt=media&token=34999844-2023-4566-985d-08a8fa23e6dc" />
    </div>
  `
})
export class ItemComponent {
  @Input() uid;
  text: string;
  isEditedBy = null;
  myVotes;
  votes = 0;
  currentStepKey = "ADD_ITEMS";

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
    
    this.fb.ref(`items/${this.uid}/votes`).on('value', (snapshot) => {
      this.votes = 0;
      snapshot.forEach((item) => {
        console.log(this.text + ':' + item.val());
        this.votes +=  item.val();
      })
    });

    this.fb.ref('step').on('value', (snapshot)=>{
      this.currentStepKey = snapshot.val();
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

    this.fb.ref(`votes/${userUid}`).transaction((votes) => {
      if(!votes) {
        votes = 1;
      } else {
        votes += 1;
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

    this.fb.ref(`votes/${userUid}`).transaction((votes) => {
      if(votes >= 1) {
        votes -= 1;
      }
      return votes;
    });
  }

  get showItemVoting() {
    return (this.currentStepKey === 'VOTE' || this.currentStepKey === 'SELECT');
  }

  get showVotes() {
    if (this.currentStepKey === 'VOTE'){
      return this.myVotes > 0;
    }else if(this.currentStepKey === 'SELECT'){
      return true;
    }
    
  }
  
  get votesCount(){
    if(this.currentStepKey === 'VOTE'){
      return this.myVotes;
    }else if(this.currentStepKey === 'SELECT'){
      return this.votes;
    }
  }

  get showUnvoteButton() {
    return this.myVotes > 0;
  }
}

class voteStep(){
  votes = 0;
  
  get showVotes(){
    return true;
  }
  
  get votes(){
    
  }
  constructor(private fb:any, private uid: String, private currentUser: any){
    //observe only users votes;
    this.fb.ref(`items/${this.uid}/votes/${this.fb.currentUser.uid}`).on('value', (snapshot) => {
      this.votes = snapshot.val();
      this.ref.detectChanges();
    });
  }
}