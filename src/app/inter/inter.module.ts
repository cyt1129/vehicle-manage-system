import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {InterRoutes} from "./inter.routes";
import {InterComponent} from "../inter/inter.component";
import {NgZorroAntdModule } from 'ng-zorro-antd';
import { CfgModule } from "./cfg/cfg.module";
import { DashboardModule } from "./dashboard/dashboard.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgZorroAntdModule,
    DashboardModule,
    CfgModule,
    RouterModule.forChild(InterRoutes),
    //RouterModule.forRoot()
  ],
  exports: [],
  declarations: [
    InterComponent,

  ],
  providers: []
})
export class InterModule {
}