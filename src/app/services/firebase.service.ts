import {Injectable} from '@angular/core';

declare var firebase: any;
declare var window: any;

@Injectable()
export class FirebaseService {

  private retroUid: string = window.location.pathname;

  initRetro() {
    return firebase.database().ref(`retros/${this.retroUid}`).transaction((retro) => {
      if (!retro) {
        retro = {
          buckets: {
            '1': {
              color: '#ffff8d',
              icon: 'start',
              name: 'Start doing'
            },
            '2': {
              color: '#a7ffeb',
              icon: 'continue',
              name: 'Continue'
            },
            '3': {
              color: '#ff8a80',
              icon: 'stop',
              name: 'Stop doing'
            }
          },
          step: 'ADD_ITEMS'
        };
      }
      return retro;
    }).then(() => {
      this.ref(`participants/${this.currentUser.uid}`).set({
        name: this.currentUser.displayName,
        email: this.currentUser.email,
        photoURL: this.currentUser.photoURL
      });
    });
  }

  get currentUser() {
    return firebase.auth().currentUser;
  }

  ref(path: string) {
    return firebase.database().ref(`retros/${this.retroUid}/${path}`);
  }
}
