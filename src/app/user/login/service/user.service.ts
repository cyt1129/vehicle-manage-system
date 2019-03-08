import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {User} from "../../../inter/dashboard/header/model/user";

import "rxjs/add/operator/toPromise";

import {Token} from "../model/token";
import {Subject} from "rxjs/Subject";
import {Message} from "../../../inter/dashboard/model/message";
import {environment} from "../../../../environments/environment";

@Injectable()
export class UserService {
  // POST /api/auth/login
  private mockAuthLogin = "assets/mock-data/login-mock.json";
  //private authLoginUrl = "http://" + environment.serverUrl + "/api/auth/login";
  private authLoginUrl = environment.serverUrl + "/auth/login";

  // GET /api/auth/user
  private mockAuthUserUrl = "assets/mock-data/auth-user-mock.json";
 // private authUserUrl = "http://" + environment.serverUrl + "/api/auth/user";
 private authUserUrl = environment.serverUrl + "/auth/user";

  // GET /api/customer/{customerId}
  private mockCustomerUrl = "assets/mock-data/customer-mock.json";
  //private customerUrl = `http://${environment.serverUrl}/api/customer`;
  private customerUrl = `${environment.serverUrl}/customer`;


  private httpOption: RequestOptions;
  /*add*/
  // private _deviceIds = [];
  // get deviceIds() {
  //   return this._deviceIds;
  // }

  constructor(private http: Http) {
    let token = localStorage.getItem("token");
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-Authorization': 'Bearer ' + token
    });
    this.httpOption = new RequestOptions({
      headers: headers
    });
  }

  getUserInfo(): Subject<Message> {
    let subject = new Subject<any>();
    // TODO deal with this callback hell.
    //auth/user得到用户信息
    this.http.get(this.authUserUrl, this.httpOption).toPromise()
      .then(response => {
        console.log(this.httpOption);
        let auth_user = response.json();
       
        let user = new User();
        user.id = auth_user.customerId.id;
        //user.email = auth_user.customerId.email;
        
        user.authority = auth_user.authority;
        user.firstName = auth_user.firstName;
        user.lastName = auth_user.lastName;

        localStorage.setItem("userid", user.id);
        subject.next(new Message("userinfo", user));
        return user.id;
      })
      //api/customer/customerId获得customer的公司、邮箱等信息
      .then((id) => {
        this.http.get(this.customerUrl + "/" + id, this.httpOption).toPromise()
          .then(response => {
            let user = new User();
            let customer = response.json();
            //console.info(customer);
            //user.country = customer.country;
            //user.state = customer.state;
            //user.city = customer.city;
            //user.address = customer.address;
            //user.zip = customer.zip;
            //user.phone = customer.phone;

            user.companyName = customer.title;
            subject.next(new Message("companyinfo", user));
            return id;
          })
          //api/customer/customerId/devices?limit=50获得cutomer的设备们的id
          .then((id) => {
            this.http.get(`${this.customerUrl}/${id}/devices?limit=50`, this.httpOption).toPromise()
              .then(response => {
                // TODO hasNext hasn't implemented yet.
               // let data = response.json().data;
               const data = response.json().data;
                //console.log(data);
                let deviceIds = [];

                data.map(ele => {
                  deviceIds.push(ele.id.id);
                });
                subject.next(new Message("deviceList", deviceIds));
              })
          })
      })
      .catch(this.handleError);

    return subject;
  }

  // getUserDeviceList(): Promise<string[]>{
  //   return this.http.get(`${this.customerUrl}/${localStorage.getItem("userid")}/devices?limit=50`,this.httpOption).toPromise()
  //     .then(response => {
  //       let data = response.json().data;
  //       let devList = [];
  //       data.map(
  //         d => {
  //           devList.push(d.id.id);
  //         });
  //       //console.log(devList);
  //       return devList;
  //     })
  // }

  login(username: string, password: string): Promise<Token> {
    let data = {
      username: username,
      password: password
    };

    return this.http.post(this.authLoginUrl, data).toPromise()
    //return this.http.get(this.mockAuthLogin).toPromise()
      .then(response => {
        if (response.status == 200) {
          let body = response.json();
          localStorage.setItem("token", body.token);
          console.log("user token:"+body.token);
          localStorage.setItem("refreshToken", body.refreshToken);
        }
        else {
          Promise.reject("login failed!");
        }
      })
      .catch(this.handleHttpError)
  }


  keepalive(): void {
    // TODO
  }

  logout(): void {
    localStorage.clear();
  }

  private handleError(error: any): Promise<any> {
    console.error('error occurred', error);
    return Promise.reject(error.message || error);
  }

  private handleHttpError(error: any): Promise<any> {
    return Promise.reject(error.json());
  }
}
