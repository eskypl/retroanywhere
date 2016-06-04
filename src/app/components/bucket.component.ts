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
      outline: none;
    }
    .ret-bucket-name {
      text-align: center;
      line-height: 3.125rem;
    }
    .ret-bucket-name .icon {
      display: inline-block;
      width: 3.125rem;
      height: 3.125rem;
      border-radius: 50%;
      background-color: #303b46;
      position: relative;
      top: -.9375rem;
      font-size: 1.25rem;
      margin-right: 1rem;
    }
    .ret-bucket-name .icon::before {
      position: relative;
      top: .9375rem;
    }
    .ret-item-add .icon {
      display: inline-block;
      width: 4.375rem;
      height: 4.375rem;
      border-radius: 50%;
      background-color: #1c2b39;
      color: #fff;
      position: relative;
      font-size: 2.313rem;
    }
    .ret-item-add .icon::before {
      position:relative;
      top: .938rem;
    }
  `],
  template: `
    <h2 class="ret-bucket-name">
        <span class="icon icon-{{icon}}" [style.color]="color"></span> {{name}}
    </h2>
    <div class="ret-items">
        <ret-item *ngFor="let uid of itemUids" [uid]="uid" [style.background]="color"></ret-item>
        <button class="ret-item-add" (click)="addItem()">
            <span class="icon icon-plus"></span>
        </button>
    </div>
  `
})
export class BucketComponent {
  @Input() name: string;
  @Input() color: string;
  @Input() icon: string;
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
