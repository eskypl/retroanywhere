import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {ActionComponent} from './action.component';

const INITIAL_ACTION_TEXT = 'start typing here...';

@Component({
  selector: 'ret-selected-item',
  directives: [ActionComponent],
  styles: [`
    :host {
      display: block;
      margin: 1.25rem 0 0 0;
      flex-basis: 16.875rem;
      min-height: 10rem;
      background: #2b465e;
      border-radius: 3px;
      overflow: hidden;
      color: #dcdee3;
    }
    .text {
      border: none;
      outline: none;
      box-sizing: border-box;
      width: 100%;
      overflow: hidden;
      background: transparent;
      color: #182531;
      padding: 2rem;
      font: 700 1rem 'Ubuntu', sans-serif;
      border-radius: 3px;
    }
    .new-action {
      border: none;
      outline: none;
      box-sizing: border-box;
      width: 100%;
      overflow: hidden;
      background: transparent;
      color: #dcdee3;
      padding: 2rem;
      font: 400 .875rem 'Ubuntu', sans-serif;
    }        
  `],
  template: `
    <div class="text" [style.background]="color">{{text}}</div>
    <ret-action *ngFor="let actionId of actionIds" [uid]="actionId" [itemId]="itemId"></ret-action>
    <button class="add-action" (click)="addAction()">add</button>
  `
})
export class SelectedItemComponent {
  @Input() itemId;
  actionIds = [];
  text:string;
  color:string;

  constructor(
    private fb:FirebaseService,
    private ref:ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fb.ref(`actions/${this.itemId}`).once('value', snapshot => {
      let actions = snapshot.val();
      if (actions) {
        this.actionIds = Object.keys(actions);
      } else {
        this.addAction();
      }

      this.ref.detectChanges();
    });

    this.fb.ref(`items/${this.itemId}`).on('value', snapshot => {
      let {text, bucket} = snapshot.val();
      this.text = text;
      this.fb.ref(`buckets/${bucket}`).on('value', snapshot => {
        let {color} = snapshot.val();
        this.color = color;

        this.ref.detectChanges();
      });
    });
  }

  addAction() {
    let action = this.fb.ref(`actions/${this.itemId}`).push({
      initial: true,
      text: INITIAL_ACTION_TEXT
    });
    this.actionIds.push(action.key);
  }

}
