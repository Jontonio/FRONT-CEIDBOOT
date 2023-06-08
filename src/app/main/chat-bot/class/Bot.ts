
class ResBot{
  constructor(public msg:string, public ok:boolean,  public data:ClientInfo | any){}
}

interface ClientInfo {
pushname: string;
wid: Wid;
me: Wid;
phone: undefined;
platform: string;
}

interface Wid {
server: string;
user: string;
_serialized: string;
}

export { ResBot, ClientInfo };
