import { Component, OnInit } from '@angular/core';
import { User } from  './model/user';
import {UserService} from "../../../user/login/service/user.service";
import {Router} from "@angular/router";
import "rxjs/add/operator/filter";

@Component({
  selector: 'dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [UserService]
})
export class HeaderComponent implements OnInit {

  user = new User();

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService.getUserInfo()
      .filter(data => {
        //console.log(data);
        let condition = data.name == "userinfo" || data.name == "companyinfo";
        return condition;
      })
      .subscribe(data => {
        console.log(data);
        Object.assign(this.user,data.data);
      });
  }

  logoutButtonClickHandler(): void{
    this.userService.logout();
    this.router.navigateByUrl("/");
  }

  loginCfg():void{
    this.router.navigateByUrl("cfg");
  }

}
