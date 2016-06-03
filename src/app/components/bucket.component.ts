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
      padding: 1em 2.5em;
      color:#f6f7f8;
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
  @Input() id:string = 'BucketId';
  
  itemUids:string[] = [];
  private _items:any = this.fb.ref('items');

  constructor(
      private fb:FirebaseService,
      private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._items.on('child_added', (snapshot) => {
      var item = snapshot.val()
      if(item.bucket === this.id){
        this.itemUids.push(snapshot.key);
      }
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
