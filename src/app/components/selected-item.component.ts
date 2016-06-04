import {Component, Input, OnInit, ChangeDetectorRef, Output} from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {ActionComponent} from './action.component';
import {EventEmitter} from '@angular/compiler/src/facade/async';

@Component({
  selector: 'ret-selected-item',
  directives: [ActionComponent],
  styles: [`
    :host {
      display: block;
      margin: 1.25rem 0 0 1.25rem;
      flex-basis: 35rem;
      background: #2b465e;
      border-radius: 3px;
      /*overflow: hidden;*/
      color: #dcdee3;
      position: relative;
      padding-bottom: 3rem;
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
      outline: none;
    }
    .add-action {
      position: absolute;
      bottom: 0;
      background: #1c2b39;
      color: #fff;
      border: 0;
      padding: 1rem;
      margin: 0;
      width: 100%;
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
      cursor: pointer;
      outline: none;
    }
    ret-action + ret-action {
      border-top: 1px solid #475f75;
    }
  `],
  template: `
    <div class="text" [style.background]="color">{{text}}</div>
    <ret-action *ngFor="let actionId of actionIds" [uid]="actionId" [itemId]="itemId" (teammateSelector)="onSelector($event)"></ret-action>
    <button class="add-action icon-plus" (click)="addAction()"></button>
  `
})
export class SelectedItemComponent {
  @Input() itemId;
  @Output() temmateSelector = new EventEmitter();
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

  onSelector(i) {
    this.temmateSelector.emit(i);
  }

  addAction() {
    let action = this.fb.ref(`actions/${this.itemId}`).push({
      initial: true,
      text: ''
    });
    this.actionIds.push(action.key);
  }

}
