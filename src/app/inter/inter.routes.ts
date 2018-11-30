import { InterComponent } from "./inter.component";
import { CfgComponent } from "./cfg/cfg.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
//import { CfgComponent } from "./cfg/cfg.component";

export const InterRoutes=[

  {
    path:'inter',
    component:InterComponent,
    children:[
      {
        path:'cfg',
        component:CfgComponent//得写component，module里面导入的是cfgModule
      },
      {
        path:'',
        redirectTo:'dashboard',
        pathMatch:'full'
      },
      {
        path:'dashboard',
        component:DashboardComponent
      }

    ]
  }

];
