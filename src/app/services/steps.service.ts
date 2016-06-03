import {FirebaseService} from './firebase.service';
import {Injectable} from '@angular/core';
enum STEPS {
  ADD_ITEMS,
  VOTE,
  SELECT,
  ADD_ACTIONS
}

@Injectable()
export class StepsService {
  constructor(
    private fb:FirebaseService
  ) {}

  set activeStep(value) {
    this.fb.ref('step').set(this.getStep(value));
  }

  // This should be used for init, when step is read only once.
  // Otherwise use getActiveStep if value has to be updated
  // on any change.
  get activeStep() {
    return this.fb.ref('step').once('value');
  }

  getSteps() {
    return STEPS;
  }

  getStep(id:number|string) {
    return STEPS[id];
  }

  getStepName(id:number|string) {
    return [
      'add items',
      'vote',
      'select',
      'add actions'
    ][typeof id === 'number' ? id : this.getStep(id)]
  }

  getActiveStep(cb) {
    return this.fb.ref('step').on('value', cb);
  }
}
