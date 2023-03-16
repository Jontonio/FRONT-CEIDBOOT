
class ResHorario {
  constructor(public msg:string,public  ok:boolean, public data:Horario | Horario[], public count?:number){}
}

class Horario {
  DescHorario: string;
  HoraFinal: string;
  HoraInicio: string;
}


export { ResHorario, Horario }
