import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn:'root'
})
export class UnAuthorizedService{

  httpErrorResponse:HttpErrorResponse;
  showModalAuth:boolean;

  constructor(){
    this.showModalAuth = false;
  }

  unAuthResponse(e:HttpErrorResponse){
    this.httpErrorResponse = e;
    if(e.status==401){
      this.showModalAuth = true;
      return;
    }
  }

}
