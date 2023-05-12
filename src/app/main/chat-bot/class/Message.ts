class ResMessage{
  constructor(public msg:string, public ok:boolean, public data:any){}
}

class Message {
  Nombres:string;
  Numero: string;
  Message: string;
  constructor(Nombres:string, Numero:string, Message:string){
    this.Nombres = Nombres;
    this.Numero = Numero;
    this.Message = Message;
  }
}

export { Message, ResMessage }
