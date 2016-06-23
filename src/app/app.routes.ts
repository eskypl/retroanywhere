import { provideRouter } from '@angular/router';

import { FrontPageComponent } from './front-page/components/front-page/front-page.component';
import { TeamComponent } from './team/components/team/team.component';
import { UserComponent } from './user/components/user/user.component';
import { RetroComponent } from './retro/components/retro/retro.component';

export const routes = [
  { path: '', component: FrontPageComponent },
  { path: 't/:teamUid', component: TeamComponent },
  { path: 'u/:userUid', component: UserComponent },
  { path: 'r/:retroUid', component: RetroComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
