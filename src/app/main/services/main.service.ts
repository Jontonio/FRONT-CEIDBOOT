import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Pais } from "../class/Pais";
import { map } from 'rxjs/operators'
import { Code } from "../grupo/class/Code";
import { Observable } from "rxjs";
import { Departamento, Distrito, Provincia } from "../class/Ubigeo";
import { Modalidad } from "../matricula/interfaces/global";

@Injectable({
  providedIn:"root",
})
export class MainService{

  /** Variables de clase */
  modalidades:Modalidad[];

  constructor(private http:HttpClient){

    this.modalidades = [
      { name:'Presencial', value:'presencial'},
      { name:'Virtual', value:'virtual'},
    ];

  }

  buscarPais(termino:string, porTipo:string):Observable<Pais[]>{
    const url = `${environment.URL_COUNTRY}/${porTipo}/${termino}`;
    return this.http.get<Pais[]>(url);
  }

  getCountryCode():Observable<Code[]>{
    const url = `${environment.URL_COUNTRY}/all`;
    return this.http.get<Pais[]>(url)
        .pipe(
          map( countries => {
            const list = countries.map( (country:Pais) => {
              let subfix = ''
              if(country.idd.suffixes) subfix = country.idd.suffixes.length!=1?country.idd.suffixes[1]:country.idd.suffixes[0];
              const code = `${country.idd.root}${subfix}`
              return new Code(this.spliceName(country.name.common), code, country.flags.svg, country.cca2)
            })
            const lista = list.sort((a, b) => a.name.localeCompare(b.name));
            return lista.filter( (items) => items.codePhone!='undefined');
          })
      );
  }

  getOneCountryByCode(code:string):Observable<Code[]>{
    const url = `${environment.URL_COUNTRY}/alpha/${code}`;
    return this.http.get<Pais[]>(url)
            .pipe(
              map(countries => {
                const list = countries.map( (country:Pais) => {
                  let subfix = ''
                  if(country.idd.suffixes) subfix = country.idd.suffixes.length!=1?country.idd.suffixes[1]:country.idd.suffixes[0];
                  const code = `${country.idd.root}${subfix}`
                  return new Code(this.spliceName(country.name.common), code, country.flags.svg, country.cca2)
                })
                const lista = list.sort((a, b) => a.name.localeCompare(b.name));
                return lista.filter( (items) => items.codePhone!='undefined');
              })
      );
  }

  spliceName(name:string){
    return name.split(',')[0];
  }

  getDepartamentos():Observable<Departamento[]>{
    const url = `${environment.BASE_URL}/ubigeo/departamento`;
    return this.http.get<Departamento[]>(url);
  }

  getProvincias(IdPadreUbigeo:number):Observable<Provincia[]>{
    const url = `${environment.BASE_URL}/ubigeo/provincia/${IdPadreUbigeo}`;
    return this.http.get<Provincia[]>(url);
  }

  getDistritos(IdPadreUbigeo:number):Observable<Distrito[]>{
    const url = `${environment.BASE_URL}/ubigeo/distrito/${IdPadreUbigeo}`;
    return this.http.get<Distrito[]>(url);
  }

}
