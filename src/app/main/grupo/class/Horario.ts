
interface ResHorario {
  msg: string;
  ok: boolean;
  data: Horario;
}

interface ResGetHorario {
  msg: string;
  ok: boolean;
  data: Horario[];
}

class Horario {
  DescHorario: string;
  HoraFinal: string;
  HoraInicio: string;
}


export {
  ResHorario, Horario, ResGetHorario
}
