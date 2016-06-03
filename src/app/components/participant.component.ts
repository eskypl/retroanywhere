import {Component, Input} from '@angular/core';

@Component({
  selector: 'ret-participant',
  styles: [`
    :host {
      display: inline-block;
      border: 1px solid black;
      padding: 4px;
      margin-left: 4px;
    }
  `],
  template: `
    <img [src]="participant.photoURL"/>
    <div>{{participant.name}}</div>
  `
})
export class ParticipantComponent {
  @Input() participant;
}
