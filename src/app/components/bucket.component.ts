import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';

import {FirebaseService} from '../services/firebase.service'
import {ItemComponent} from './item.component';

declare var firebase: any;

@Component({
  selector: 'ret-bucket',
  directives: [ItemComponent],
  providers: [FirebaseService],
  styles: [`    
    :host {
      display: block;
      flex-grow: 1;
      border: 1px solid black;
      padding: 16px;
      margin-top: 4px;
    }
  `],
  template: `
    <div>{{name}}</div>
    <ret-item *ngFor="let uid of itemUids" [uid]="uid"></ret-item>
    <button (click)="addItem()">Add</button>
  `
})
export class BucketComponent {
  @Input() name: string;
  id:string = 'BucketId';
  itemUids:string[] = [];
  private _items:any = this.fb.ref('items');

  constructor(
      private fb:FirebaseService,
      private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._items.on('child_added', (snapshot) => {
      this.itemUids.push(snapshot.key);
      this.ref.detectChanges();
    });
  }

  addItem() {
    this._items.push({
      bucket: this.id,
      text: ''
    });
  }
}
