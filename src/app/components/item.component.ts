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
  `],
  template: `
    <textarea [ngModel]="text" (ngModelChange)="updateText($event)"></textarea>
  `
})
export class ItemComponent {
  @Input() uid;
  text: string;

  constructor(private fb: FirebaseService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.fb.ref(`items/${this.uid}/text`).on('value', (snapshot) => {
      this.text = snapshot.val();
      this.ref.detectChanges();
    });
  }

  updateText(text: string) {
    this.fb.ref(`items/${this.uid}/text`).set(text);
  }
}
