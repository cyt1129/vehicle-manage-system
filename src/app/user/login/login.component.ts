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
  public username: string;
  public password: string;

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

  private login(): void{
    this.userService.login(this.username,this.password)
      .then(() => {
        this._isSpinning = false;
        console.log("login success!");
        this.router.navigateByUrl("dashboard"); 
       // window.location.reload(); 
      })
      .catch(err => {
        console.info("login failure");
        console.log(err);
      })
  }

}
