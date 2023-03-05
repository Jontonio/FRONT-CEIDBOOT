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
  Nombres:string,
  ApellidoPaterno:string,
  ApellidoMaterno:string,
  TipoRol:string
}
