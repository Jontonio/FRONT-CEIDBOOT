import { EstudianteEnGrupo } from "./EstudianteGrupo";
import { Grupo } from "./Grupo";

class EstadoGrupoEstudiante {
  estadoDataPago:EstadoDataPago;
  estudiantesEnGrupo:EstudianteEnGrupo[];
  grupo:Grupo;
}

class EstadoDataPago {
  DiasPasados:number;
  DiasPorModulo:number;
  FechaActual:Date;
  FechaFinalGrupo:Date;
  FechaInicioGrupo:Date;
  FechasDePago:Date[];
  ModuloActual: number;
  ModulosCumplidos: number;
  NumDiasCurso: number;
}

export { EstadoGrupoEstudiante, EstadoDataPago}
