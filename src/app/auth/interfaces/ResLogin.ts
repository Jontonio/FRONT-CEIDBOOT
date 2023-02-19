export interface ResLogin {
  msg:string,
  ok:boolean,
  token:string,
  user:LoginUser
}

export interface LoginUser{
  Id:number,
  Email:string,
  DNI:string,
  Name:string,
  FirstName:string,
  LastName:string,
  TypeRole:string
}
