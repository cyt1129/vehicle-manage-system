import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {userRoutes} from "./user.routes";
import {LoginComponent} from "./login/login.component";
import {UserService} from "./login/service/user.service";
import {NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgZorroAntdModule,
    RouterModule.forChild(userRoutes)
  ],
  exports: [],
  declarations: [
    LoginComponent,
  ],
  providers: [UserService]
})
export class UserModule {
}
