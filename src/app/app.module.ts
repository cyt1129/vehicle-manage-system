import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {HttpModule, JsonpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {NgZorroAntdModule } from 'ng-zorro-antd';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {AppComponent} from "./app.component";
import {UserModule} from "./user/user.module";
import {appRoutes} from "./app.routes";
import {UserService} from "./user/login/service/user.service";
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import { InterModule } from "./inter/inter.module";//测试

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    JsonpModule,
    RouterModule,
    UserModule,
    InterModule,//测试
    NgZorroAntdModule.forRoot(),

    RouterModule.forRoot(appRoutes)
  ],
  //providers: [UserService],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy},UserService],

  bootstrap: [AppComponent]
})
export class AppModule {
}
