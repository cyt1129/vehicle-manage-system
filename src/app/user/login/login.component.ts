import { Component, OnInit } from '@angular/core';
import {UserService} from "./service/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  _isSpinning=false;
  showWarning=false;
  public username: string;
  public password: string;
  //public flg = 1;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit(): void{
    this._isSpinning = true;
    this.login();
  }

  cw():void{
    this.showWarning=false;
  }

  private login(): void{
    this.userService.login(this.username,this.password)
      .then(() => {
        this._isSpinning = false;
        console.log("login success!");
        //this.router.navigateByUrl("dashboard"); 
        this.router.navigateByUrl("inter");//测试用
        console.log("!!!")
       // window.location.reload(); 
      })
      .catch(err => {
        console.info("login failure");
        console.log(err);
        this.showWarning = true;
        //alert("账户或密码输入错误，请重新输入！")
        this._isSpinning = false;
      })
  }

}