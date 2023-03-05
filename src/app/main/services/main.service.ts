import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/auth/services/auth.service";
import { environment } from 'src/environments/environment';
import { Pais } from "../class/Pais";
import { map } from 'rxjs/operators'
import { Code } from "../class/Code";

@Injectable({
  providedIn:"root"
})
export class MainService{

  listCodePhone:any[];

  constructor(private http:HttpClient, private _auth:AuthService){

    this.spliceName("holis")
    this.getCountryCode().then( res => {
      this.listCodePhone = res;
    })

  }

  buscarPais(termino:string, porTipo:string):Promise<Pais[]>{

    return new Promise((resolve, reject) => {

      const url = `${environment.URL_COUNTRY}/${porTipo}/${termino}`;

      this.http.get<Pais[]>(url).subscribe({
        next: (resp) => resolve(resp),
        error: (e) => reject(e)
      });

    });

  }

  getCountryCode():Promise<Code[]>{

    return new Promise((resolve, reject) => {

      const url = `${environment.URL_COUNTRY}/all`;

      this.http.get<Pais[]>(url)
               .pipe(
                  map(countries => {
                    const list = countries.map( (country:Pais) => {
                      let subfix = ''
                      if(country.idd.suffixes) subfix = country.idd.suffixes.length!=1?country.idd.suffixes[1]:country.idd.suffixes[0];
                      const code = `${country.idd.root}${subfix}`
                      return { name: this.spliceName(country.name.common), codePhone:code, flag:country.flags.svg, code: country.cca2 };
                    })

                    const lista = list.sort((a, b) => a.name.localeCompare(b.name));

                    return lista.filter( (items) => items.codePhone!='undefined');

                  })
        ).subscribe({
          next: (resp) => resolve(resp),
          error: (e) => reject(e)
      });
    });

  }

  getOneCountryByCode(code:string):Promise<Code[]>{

    return new Promise((resolve, reject) => {

      const url = `${environment.URL_COUNTRY}/alpha/${code}`;

      this.http.get<Pais[]>(url)
               .pipe(
                  map(countries => {
                    const list = countries.map( (country:Pais) => {
                      let subfix = ''
                      if(country.idd.suffixes) subfix = country.idd.suffixes.length!=1?country.idd.suffixes[1]:country.idd.suffixes[0];
                      const code = `${country.idd.root}${subfix}`
                      return { name: this.spliceName(country.name.common), codePhone:code, flag:country.flags.svg, code: country.cca2 };
                    })

                    const lista = list.sort((a, b) => a.name.localeCompare(b.name));

                    return lista.filter( (items) => items.codePhone!='undefined');

                  })
        ).subscribe({
          next: (resp) => resolve(resp),
          error: (e) => reject(e)
      });
    });

  }

  spliceName(name:string){
    return name.split(',')[0];
  }



}
