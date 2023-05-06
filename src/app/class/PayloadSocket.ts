class PayloadSocket {
  limit:number;
  offset:number;
  Id?:string;
  constructor(limit:number, offset:number, Id?:string){
    this.limit = limit;
    this.offset = offset;
    this.Id = Id;
  }
}

export { PayloadSocket };
