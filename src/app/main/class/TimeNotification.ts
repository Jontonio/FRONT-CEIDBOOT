class ResTimeNotification{
  constructor(public msg:string, public ok:boolean, public data:TimeNotification){}
}


class TimeNotification {
  Id: number;
  HoraNotificacion: number;
  MinutoNotificacion: number;
  DescriptionNotificacion: string;
  updatedAt: string;

  constructor(HoraNotificacion:number, MinutoNotificacion:number, DescriptionNotificacion:string){
    this.HoraNotificacion = HoraNotificacion;
    this.MinutoNotificacion = MinutoNotificacion;
    this.DescriptionNotificacion = DescriptionNotificacion;
  }
}

export { ResTimeNotification, TimeNotification }
