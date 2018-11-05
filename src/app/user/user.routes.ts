import {LoginComponent} from "./login/login.component";
export const userRoutes=[
  {
    path:'',
    redirectTo:'userLogin',
    pathMatch:'full'
  },
  {
    path:'userLogin',
    component: LoginComponent
  }
];
