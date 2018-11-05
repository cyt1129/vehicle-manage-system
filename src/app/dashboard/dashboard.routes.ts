import {DashboardComponent} from "./dashboard.component";
export const dashboardRoutes=[
  {
    path:'',
    redirectTo:'dashboard',
    pathMatch:'full'
  },
  {
    path:'dashboard',
    component: DashboardComponent
  }
];
