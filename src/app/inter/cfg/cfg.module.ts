import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {cfgRoutes} from "./cfg.routes";
import {CfgComponent} from "./cfg.component";
import {DevicesComponent} from "./header-panel/devices-list.component";
import {DeviceAttrListComponent} from "./attrlist-panel/device-attr-list.component";
//import {HeaderComponent} from "../../dashboard/header/header.component";
import {UserService} from "../../user/login/service/user.service";
import { FormsModule } from '@angular/forms';
import {JsonpModule} from '@angular/http';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    JsonpModule,
    RouterModule.forChild(cfgRoutes)
  ],
  exports: [],
  declarations: [
    CfgComponent,
    DevicesComponent,
    DeviceAttrListComponent,
  ],
  providers: [UserService,DeviceAttrListComponent]
})
export class CfgModule {
}