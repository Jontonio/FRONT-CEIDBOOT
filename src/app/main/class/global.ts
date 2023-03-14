import { Curso } from "../curso/class/Curso"
import { Docente } from "../docente/class/Docente"
import { Usuario } from "../usuario/class/Usuario"

export interface optionOperation{
  data: Docente | Usuario | Curso,
  option: boolean // true = update, false = register
  Id?: number // this is required if is update
}
