interface ResLogin {
  msg:string,
  ok:boolean,
  token:string,
  user:UserLogin
}

interface UserLogin{
  Id:number,
  Email:string,
  DNI:string,
  Nombres:string,
  ApellidoPaterno:string,
  ApellidoMaterno:string,
  TipoRol:string,
  Celular:string,
  Direccion:string
}

export { ResLogin, UserLogin }
