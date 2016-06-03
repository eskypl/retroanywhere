  export class StepService {
    private stepKey = "ADD_ITEMS";
    steps = [{key: "ADD_ITEMS", value: "Add items"},
      {key: "VOTE", value: "Vote"},
      {key: "SELECT", value: "Select items"},
      {key: "ADD_ACTIONS", value: "Add actions"}]; 
      
    goToStep(step){
      this.stepKey = step;
    }
    
    get currentStepKey(){
      return this.stepKey;
    }
  }

  