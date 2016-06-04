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
    
    /* general */
    /* this should disable items with 0 votes
     * on select step, however stepsStrategy adds
     * show-votes class anyway on this step, so this
     * rule does not work as expected. */
    :host-context(.not-VOTE) .ret-item-voting {
      visibility: hidden !important;
    }
    
    /* vote step */
    :host-context(.VOTE) .ret-select {
      display: none;
    }
    :host-context(.VOTE) .ret-vote-actions:hover,
    :host-context(.VOTE) .ret-item-voting.show-votes {
      visibility: visible;
    }
    
    /* select step */
    :host-context(.SELECT) .ret-vote-actions {
      display: none;
    }
    :host-context(.SELECT) .ret-item-voting.show-votes {
      visibility: visible !important;
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
      font: 700 1rem 'Ubuntu', sans-serif;
      resize: none;
    }
    .edited-by-section {
      padding: .625rem;
      min-height: 2.5rem;
      max-height: 2.5rem;
      line-height: 2.5rem;
      color: #182531;
      font-size: .875rem;
    }
    .edited-by-content.ng-enter {
      transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.125);
      transform: scale(0);
    }
    .edited-by-content.ng-enter-active {
      transform: scale(1);
    }
    .edited-by-icon {
      position: relative;
      top: 5px;
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
      outline: none;
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
    .ret-select {
      display: inline-block;
      float: left;
      width: 1.625rem;
      height: 1.625rem;
      line-height: 1.625rem;
      background: #fff;
      border-radius: 3px;
      margin: .625rem 0 .625rem 1rem;
      color: #1da023;
      text-align: center;
    }
    .ret-select input {
      visibility: hidden;
    }
  `],
  template: `
    <div [ngClass]="{'ret-item-voting': true, 'has-votes': stepStrategy.hasVotes, 'show-votes': stepStrategy.showVotes}">
      <label [ngClass]="{'ret-select': true, 'icon-check': selected}">
        <input [(ngModel)]="selected" type="checkbox"/>        
      </label>    
      <span class="ret-vote-count">{{stepStrategy.votes}} <span class="sufix">votes</span></span>
      <div class="ret-vote-actions" *ngIf="stepStrategy.showItemVoting">
        <button *ngIf="stepStrategy.showUnvoteButton" (click)="removeVote()"><span class="icon icon-minus_2"></span></button> 
        <button *ngIf="stepStrategy.showItemVoting" (click)="addVote()"><span class="icon icon-plus_2"></span></button>
      </div>
    </div>
    <textarea [placeholder]="placeholder" [ngModel]="text" (ngModelChange)="updateText($event)" 
      (focus)="onFocus()"
      (blur)="onBlur()">
    </textarea>
    <div class="edited-by-section">
      <div *ngIf="isEditedBy" class="edited-by-content ng-animate">
        <img class="edited-by-image" [src]="isEditedBy.photoURL"/>
        {{isEditedBy?.name}}
        <span class="bubble dark edited-by-icon"></span>
      </div>      
    </div>
  `
})
export class ItemComponent {
  @Input() uid;
  text: string;
  isEditedBy = null;
  stepStrategy: any;
  currentStepKey = "ADD_ITEMS";
  private focused = false;

  private _selected:boolean = false;

  constructor(private fb: FirebaseService, private ref: ChangeDetectorRef) {
    this.stepStrategy = new AddItemStepStrategy(this.fb, this.uid);
  }

  ngOnInit() {
    //observe text
    this.fb.ref(`items/${this.uid}/text`).on('value', (snapshot) => {
      this.text = snapshot.val();
      this.ref.detectChanges();
    });

    //observe edit
    this.fb.ref(`items/${this.uid}/isEditedBy`).on('value', (snapshot) => {
      this.isEditedBy = snapshot.val();
      this.ref.detectChanges();
    });

    //select step
    this.fb.ref('step').on('value', (snapshot)=>{
      this.currentStepKey = snapshot.val();
      this.ref.detectChanges();
      switch(snapshot.val()){
        case "ADD_ITEMS": this.stepStrategy = new AddItemStepStrategy(this.fb, this.uid);break;
        case "VOTE": this.stepStrategy = new VoteStepStrategy(this.fb, this.uid);break;
        case "SELECT": this.stepStrategy = new SelectStepStrategy(this.fb, this.uid); break;
        default: this.stepStrategy = new AddItemStepStrategy(this.fb, this.uid)
      }
    });

    this.fb.ref(`items/${this.uid}/selected`).once('value', snapshot => {
      this.selected = snapshot.val() || false;
    });
  }

  updateText(text: string) {
    this.fb.ref(`items/${this.uid}/text`).set(text);
  }

  onFocus() {
    this.focused = true;

    let currentUser = this.fb.currentUser;

    this.fb.ref(`items/${this.uid}/isEditedBy`).set({
      name: currentUser.displayName,
      photoURL: currentUser.photoURL
    });
  }

  onBlur() {
    this.focused = false;

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

  get selected() {
    return this._selected;
  }

  set selected(value) {
    this._selected = value;
    this.fb.ref(`items/${this.uid}/selected`).set(this._selected);
  }

  get placeholder() {
    return this.focused ? '' : '...';
  }
}

class VoteStepStrategy{
  private _votes = 0;

  get showVotes() {
    return (this._votes > 0);
  }

  get hasVotes() {
    return (this._votes > 0);
  }

  get votes(){
    return this._votes;
  }

  get showItemVoting(){
    return true;
  }

  get showUnvoteButton(){
    return (this._votes > 0);
  }

  constructor(fb, uid){
    //observe only users votes;
    fb.ref(`items/${uid}/votes/${fb.currentUser.uid}`).on('value', (snapshot) => {
      this._votes = snapshot.val() || 0;
    });
  }

  name = 'vote';
}

class SelectStepStrategy{
  private _votes = 0;

  get showVotes() {
    return true;
  }

  get hasVotes(){
    return (this._votes > 0);
  }

  get votes(){
    return this._votes;
  }

  get showItemVoting(){
    return false;
  }

  get showUnvoteButton(){
    return false;
  }
  constructor(fb, uid){
    //observe all votes;
    fb.ref(`items/${uid}/votes`).on('value', (snapshot) => {
      this._votes = 0;
      snapshot.forEach((item) => {
        this._votes +=  item.val();
      })
    });
  }

  name = 'select';
}

class AddItemStepStrategy{

  get showVotes() {
    return false;
  }

  get hasVotes (){
    return false;
  }

  get votes(){
    return 0;
  }

  get showItemVoting(){
    return false;
  }

  get showUnvoteButton(){
    return false;
  }

  constructor(fb, uid){
  }

  name = 'add';
}
