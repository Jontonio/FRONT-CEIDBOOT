import { EstudianteEnGrupo } from "./EstudianteGrupo";
import { Grupo } from "./Grupo";

interface InfoDateGrupo{
  diasTranscurridos:string,
  fechaActual:Date;
}

class EstadoGrupoEstudiante {
  infoDateGrupo:InfoDateGrupo;
  estudiantesEnGrupo:EstudianteEnGrupo[];
  grupo:Grupo;
}

export { EstadoGrupoEstudiante, InfoDateGrupo }
