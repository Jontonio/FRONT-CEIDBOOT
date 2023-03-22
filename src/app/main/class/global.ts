import { Curso } from "../curso/class/Curso"
import { Docente } from "../docente/class/Docente"
import { Grupo } from "../grupo/class/Grupo"
import { Usuario } from "../usuario/class/Usuario"

export interface optionOperation{
  data: Docente | Usuario | Curso | Grupo,
  option: boolean // true = update, false = register
  Id?: number // this is required if is update
}
