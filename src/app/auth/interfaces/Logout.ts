import { LoginUser } from "./ResLogin";

class ResLogout{
  constructor(public msg:string, public ok:boolean, public user:LoginUser){}
}

class Logout{
  Id?:number;
  Email?:string;

  constructor(Id?:number, Email?:string){
    this.Id = Id;
    this.Email = Email;
  }

}

export { ResLogout, Logout }
