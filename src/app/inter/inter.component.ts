import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './dashboard/header/model/user';
import { UserService } from '../user/login/service/user.service';

@Component({
  selector: 'app-inter',
  templateUrl: './inter.component.html',
  styleUrls: ['./inter.component.css']
})
export class InterComponent implements OnInit {

  user = new User();
  dashboard = true;
  cfg = false;

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

  dbSelected():void{
    this.dashboard = true;
    this.cfg = false;
  }

  cfgSelected():void{
    this.cfg = true;
    this.dashboard = false;
  }


}
