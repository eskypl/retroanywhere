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
      min-width: 35rem;
      padding: 1rem 2.5rem 1rem 2.5rem;
      color:#f6f7f8;
    }
    .ret-items {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .ret-item-add {
      display: block;
      margin: 1.25rem 0 0 0;
      flex-basis: 16.875rem;
      min-height: 10rem;
      border-radius: 3px;
      overflow: hidden;
      border: 0;
      background: #2b465e;
      color: #fff;
      cursor: pointer;
    }
    .ret-bucket-name {
      margin: 0 auto;
    }
  `],
  template: `
    <h2 class="ret-bucket-name">{{name}}</h2>
    <div class="ret-items">
        <ret-item *ngFor="let uid of itemUids" [uid]="uid" [style.background]="color"></ret-item>
        <button class="ret-item-add" (click)="addItem()">Add</button>
    </div>
  `
})
export class BucketComponent {
  @Input() name: string;
  @Input() color: string;
  @Input() id:string = 'BucketId';

  itemUids:string[] = [];
  private _items:any = this.fb.ref('items');

  constructor(
      private fb:FirebaseService,
      private ref:ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._items.on('child_added', (snapshot) => {
      var item = snapshot.val();
      if(item.bucket === this.id){
        this.itemUids.push(snapshot.key);
      }
      this.ref.detectChanges();
    });
  }

  addItem() {
    this._items.push({
      bucket: this.id,
      text: '',
      votes: {
        [this.fb.currentUser.uid]: 0
      }
    });
  }
}
