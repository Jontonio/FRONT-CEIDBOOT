interface Sexo {
  name:string,
  code:string,
}

interface Edad{
  name:string,
  value:boolean,
}

interface Institucion{
  name:string,
  value:string,
  code:number
}

interface Escuela{
  name:string,
  value:string
}
interface Modalidad{
  name:string,
  value:string
}
export { Edad, Sexo, Institucion, Escuela, Modalidad}
