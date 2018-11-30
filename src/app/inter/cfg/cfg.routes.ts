import {CfgComponent} from "./cfg.component";
export const cfgRoutes=[
  {
    path:'',
    redirectTo:'cfg',
    pathMatch:'full'
  },
  {
    path:'cfg',
    component: CfgComponent
  }
];
