import {Component, Input} from '@angular/core';

import {ItemComponent} from './item.component';

@Component({
  selector: 'ret-bucket',
  directives: [ItemComponent],
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
    <div>{{bucket.name}}</div>
    <ret-item *ngFor="let item of items"></ret-item>
  `
})
export class BucketComponent {
  @Input() bucket: Bucket;
  items: number[] = [1, 2, 3, 4, 5, 6];
}

export class Bucket{
  id: string;
  name: string;
  constructor(id, name){
    this.id = id;
    this.name = name;
  }
}