import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';

import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'ret-item',
  styles: [`
    :host {
      display: inline-block;
      border: 1px solid black;
      padding: 4px;
      margin-left: 4px;      
    }
    textarea {
      width: 160px;
      height: 80px;
      border: none;
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
