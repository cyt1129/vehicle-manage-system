import {RouterModule} from '@angular/router';

export const appRoutes = [
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full'
  },
  {
    path: "user",
    loadChildren: './user/user.module#UserModule'
  },
  {
    path: "dashboard",
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },
  {
    path: "cfg",
    loadChildren: './cfg/cfg.module#CfgModule'
  }
];
