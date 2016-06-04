import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';

import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'ret-action',
  styles: [`
    :host {
      display: block;
      padding: 0;
      flex-basis: 16.875rem;
      /*min-height: 10rem;*/
      background: #2b465e;
      border-radius: 3px;
      overflow: hidden;
      color: #182531;
      position: relative;
    }
    textarea {
      border: none;
      outline: none;
      box-sizing: border-box;
      width: 100%;
      overflow: hidden;
      background: transparent;
      color: #dcdee3;
      padding: 1rem 2rem;
      font-family: 'Ubuntu', sans-serif;
      font-weight: bold;
    }
    textarea.initial {
      color: #969dac;
      font-weight: 400;
    }
    .edited-by-section {
      position: absolute;
      right: 2rem;
      bottom: 1.3rem;
      color: #969dac;
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
    .selected-teammate {
      padding: 1rem 2rem;
      min-height: 2.5rem;
      max-height: 2.5rem;
      line-height: 2.5rem;
      color: #969dac;
      font-size: .875rem;
    }
    .selected-teammate-image {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      float: left;
      margin-right: .625rem;    
    }
    .add-teammate {
      display: block;
      color: #f6f7f8;
      font-size: 0.875rem;
      line-height: 1.563rem;
      padding: 1rem 2rem;
      cursor: pointer;
      border: 0;
      background: transparent;
      outline: none;
    }
    .add-teammate .icon {
      color: #1c2b39;
      font-size: 1.563rem;
      position: relative;
      padding-right: .5rem;
    }
    .add-teammate .icon::before {
      position: relative;
      top: .438rem;
      z-index: 2;
    }
    .add-teammate .icon::after {
      content: "";
      display: inline-block;
      width: 1.363rem;
      height: 1.363rem;
      background: #fff;
      border-radius: 50%;
      position: absolute;
      left: 0.1rem;
      top: .438rem;
      z-index: 1;
    }
  `],
  template: `
    <textarea placeholder="start typing here..."
      [ngClass]="{initial: initial}"
      [ngModel]="text" 
      (ngModelChange)="updateText($event)" 
      (focus)="onFocus()" (blur)="onBlur()"
    ></textarea>
    <div class="edited-by-section">
      {{isEditedBy?.name}}
      <img class="edited-by-icon" *ngIf="isEditedBy" src="https://firebasestorage.googleapis.com/v0/b/eskyid-retro-app.appspot.com/o/img%2Ftyping.gif?alt=media&token=34999844-2023-4566-985d-08a8fa23e6dc" />
    </div>
    <div *ngIf="teammate" class="selected-teammate">
      <img class="selected-teammate-image" [src]="teammate.photoURL"/>
      {{teammate.name}}
    </div>      
    <button *ngIf="!teammate" class="add-teammate">
      <span class="icon icon-plus_2"></span> add teammate 
    </button>
  `
})
export class ActionComponent {
  @Input() uid;
  @Input() itemId;
  initial = true;
  text: string;
  isEditedBy = null;
  teammate = null;
  myVotes;

  constructor(private fb: FirebaseService, private ref: ChangeDetectorRef) {
  }

  private getPath(sub){
    return `actions/${this.itemId}/${this.uid}/${sub}`;
  }

  ngOnInit() {
    this.fb.ref(this.getPath('initial')).on('value', (snapshot) => {
      this.initial = snapshot.val();
      this.ref.detectChanges();
    });

    this.fb.ref(this.getPath('text')).on('value', (snapshot) => {
      this.text = snapshot.val();
      this.ref.detectChanges();
    });

    this.fb.ref(this.getPath('isEditedBy')).on('value', (snapshot) => {
      this.isEditedBy = snapshot.val();
      this.ref.detectChanges();
    });
  }

  updateText(text: string) {
    this.fb.ref(this.getPath('initial')).set(text === '');
    this.fb.ref(this.getPath('text')).set(text);
  }

  onFocus() {
    let currentUser = this.fb.currentUser;

    this.fb.ref(this.getPath('isEditedBy')).set({
      name: currentUser.displayName,
      photoURL: currentUser.photoURL
    });
  }

  onBlur() {
    this.fb.ref(this.getPath('isEditedBy')).set(null);
  }
}
