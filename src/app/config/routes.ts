import {provideRouter} from '@angular/router';

import {StartPageComponent} from '../components/start-page.component';
import {RetroComponent} from '../components/retro.component';

export const routes = [
  { path: '', component: StartPageComponent },
  { path: 'r/:retroUid', component: RetroComponent}
];

export const ROUTER_PROVIDERS = [
  provideRouter(routes)
];
