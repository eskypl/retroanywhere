declare var firebase: any;

export class FirebaseService {
  get currentUser() {
    return firebase.auth().currentUser;
  }

  ref(path: string) {
    return firebase.database().ref(path);
  }
}
