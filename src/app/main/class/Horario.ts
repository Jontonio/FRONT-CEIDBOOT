
export interface ResHorario {
  msg: string;
  ok: boolean;
  data: Horario;
}

export class Horario {
  DescHorario: string;
  HoraFinal: string;
  HoraInicio: string;
}
