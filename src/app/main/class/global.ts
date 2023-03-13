import { Curso } from "./Curso"
import { Docente } from "./Docente"
import { Usuario } from "./Usuario"

export interface optionOperation{
  data: Docente | Usuario | Curso,
  option: boolean // true = update, false = register
  Id?: number // this is required if is update
}
