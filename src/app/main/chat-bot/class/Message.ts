class ResMessage{
  constructor(public msg:string, public ok:boolean, public data:any){}
}

class Message {
  Numero: string;
  Message: string;
  constructor( Numero:string, Message:string ){
    this.Numero = Numero;
    this.Message = Message;
  }
}

export { Message, ResMessage }
