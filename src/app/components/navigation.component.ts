import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {StepsService} from '../services/steps.service';

@Component({
  selector: 'ret-navigation',
  providers: [StepsService],
  styles: [`
    :host {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      z-index: 100;
      background: rgba(0,0,0,.4);
      padding: 1rem;
      border-radius: 3px;
      font-size: 1.125rem;
    }
    .icon {
      color: #fff;
      font-size: 1.563rem;
      line-height: 1.563rem;
      height: 1.563rem;
      width: .938rem;
      background: transparent;
      border: 0;
      padding: 0;
      margin: 0;
      outline: none;
      cursor: pointer;
      transition: transform 0.5s ease;
    }
    .icon:hover {
      transform: scale(1.3);
    }
    .icon-left {
      float: left;
    }
    .icon-right {
      float: right;
    }
    .step-number {
      display: inline-block;
      margin: 0 1rem;
    }
  `],
  template: `
    <button class="icon icon-left" (click)="prevStep()"></button>
    <span class="step-number"><strong>{{activeStep + 1}}</strong> / <strong>4</strong></span>
    <button class="icon icon-right" (click)="nextStep()"></button>
  `
})
export class NavigationComponent {
  activeStep:number = 1;

  constructor(
    private steps:StepsService,
    private ref:ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.steps.getActiveStep(snapshot => {
      this.activeStep = this.steps.getStep(snapshot.val());
      this.ref.detectChanges();
    });
  };

  nextStep() {
    if (this.activeStep < 3) {
      this.steps.activeStep = ++this.activeStep;
    }
  }

  prevStep() {
    if (this.activeStep > 0) {
      this.steps.activeStep = --this.activeStep;
    }
  }
}
