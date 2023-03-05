interface ResGrupo {
  msg: string;
  ok: boolean;
  data: Grupo;
}

interface ResGetGrupo {
  msg: string;
  ok: boolean;
  count:number;
  data: Grupo;
}

class Grupo {
  NombreGrupo: string;
  DescGrupo: string;
}

export {
  Grupo,
  ResGrupo,
  ResGetGrupo
}
