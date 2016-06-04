import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {FirebaseService} from '../services/firebase.service'
import {ActionComponent} from './action.component'
import {SelectedItemComponent} from './selected-item.component';
import {ParticipantsSelectorComponent} from './participants-selector.component';

declare var firebase: any;

@Component({
  selector: 'ret-action-list',
  directives: [SelectedItemComponent, ActionComponent, ParticipantsSelectorComponent],
  providers: [FirebaseService],
  styles: [`
    :host {
      display: flex;
      /*justify-content: space-between;*/
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 1rem 2.5rem 1rem 1.25rem;
      color:#f6f7f8;
    }
    ret-selected-item {
      margin-left: 5rem;    
    }
    ret-selected-item:nth-child(3n+1) {
      margin-left: 1.25rem;
    }
  `],
  template: `
      <ret-selected-item *ngFor="let selectedItemId of selectedItemsIds" [itemId]="selectedItemId" (temmateSelector)="onSelector($event)"></ret-selected-item>
      <ret-participants-selector *ngIf="activeAction" (close)="selectorClose()" (select)="selectorSelect($event)"></ret-participants-selector>
  `
})
export class ActionListComponent {
  selectedItemsIds = [];
  itemId = "ITEM_ID";
  actionUids:string[] = [];
  activeAction:ActionComponent = null;

  private _actions:any = this.fb.ref(`actions/${this.itemId}`);
  private _items:any = this.fb.ref(`items`);

  constructor(
      private fb:FirebaseService,
      private ref:ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._items.orderByChild('selected').equalTo(true).on('value', snapshot => {
      let selectedItems = snapshot.val();

      if (selectedItems) {
        this.selectedItemsIds = Object.keys(selectedItems);
      }
    });

    this._actions.on('child_added', (snapshot) => {
      this.actionUids.push(snapshot.key);
      this.ref.detectChanges();
    });
  }

  onSelector(action:ActionComponent) {
    if (action !== null) {
      this.activeAction = action;
    }
  }

  selectorClose() {
    this.activeAction = null;
  }

  selectorSelect(participant) {
    this.activeAction.addTeammate(participant);
    this.selectorClose();
  }
}
