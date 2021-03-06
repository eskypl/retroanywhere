import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

import { FirebaseService } from '../../../shared/services/firebase/firebase.service'
import { ActionComponent } from '../action/action.component'
import { SelectedItemComponent } from '../selected-item/selected-item.component';
import { ParticipantsSelectorComponent } from '../participants-selector/participants-selector.component';

declare var firebase: any;

@Component({
  selector: 'ra-action-list',
  directives: [ SelectedItemComponent, ActionComponent, ParticipantsSelectorComponent ],
  styles: [`
    :host {
      display: flex;
      /*justify-content: space-between;*/
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 1rem 2.5rem 1rem 1.25rem;
      color:#f6f7f8;
    }
    ra-selected-item {
      margin-left: 5rem;    
    }
    ra-selected-item:nth-child(3n+1) {
      margin-left: 1.25rem;
    }
  `],
  template: `
      <ra-selected-item *ngFor="let selectedItemId of selectedItemsIds" [itemId]="selectedItemId" (temmateSelector)="onSelector($event)"></ra-selected-item>
      <ra-participants-selector *ngIf="activeAction" (close)="selectorClose()" (select)="selectorSelect($event)"></ra-participants-selector>
  `
})
export class ActionListComponent {
  selectedItemsIds = [];
  itemId = "ITEM_ID";
  actionUids:string[] = [];
  activeAction:ActionComponent = null;

  constructor(
      private fb:FirebaseService,
      private ref:ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fb.ref(`items`).orderByChild('selected').equalTo(true).on('value', snapshot => {
      let selectedItems = snapshot.val();

      if (selectedItems) {
        this.selectedItemsIds = Object.keys(selectedItems);
      }
    });

    this.fb.ref(`actions/${this.itemId}`).on('child_added', (snapshot) => {
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
