import {Component} from '@angular/core';

@Component({
  selector: 'ret-item',
  styles: [`
    :host {
      display: inline-block;
      border: 1px solid black;
      padding: 4px;
      margin-left: 4px;      
    }
  `],
  template: `Item`
})
export class ItemComponent {}
