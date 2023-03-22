import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResPerson } from '../class/Person';
import { ResCurso } from '../main/curso/class/Curso';
import { ResHorario } from '../main/grupo/class/Horario';
import { ResDenominServicio } from '../denomin-servicio/class/Denomin-servicio';
import { Matricula, ResMatricula } from '../main/matricula/class/Matricula';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private http:HttpClient) {}
  /**
   * Saving the theme in the local storage.
   */
  saveTheme(status:boolean){
    localStorage.setItem('mode-theme', JSON.stringify(status) );
  }

  /**
   * It removes the item from local storage
   */
  deleteTheme(){
    localStorage.removeItem('mode-theme');
  }

  /**
   * If the localStorage item 'mode-theme' exists, return the value of the item, otherwise return false
   * @returns a boolean value.
   */
  existsTheme():boolean{
    if(localStorage.getItem('mode-theme')){
      return JSON.parse(localStorage.getItem('mode-theme')!);
    }
    return false;
  }

  /**
   * It makes a POST request to the server, sending the DNI as a parameter, and returns an Observable
   * of type ResPerson
   * @param {string} DNI - string
   * @returns The response of the request is being returned.
   */
  apiReniec(DNI:string):Observable<ResPerson>{
    return this.http.post<ResPerson>(`${environment.BASE_URL}/usuario/usuario-reniec`, { DNI } );
  }

  getCursosMatricula():Observable<ResCurso>{
    return this.http.get<ResCurso>(`${environment.BASE_URL}/curso/get-cursos-matriculas`);
  }

  getHorariosMatricula():Observable<ResHorario>{
    return this.http.get<ResHorario>(`${environment.BASE_URL}/horario/get-horarios-matricula`);
  }

  getDenominacionServicios():Observable<ResDenominServicio>{
    return this.http.get<ResDenominServicio>(`${environment.BASE_URL}/denomin-servicio/get-lista-denomin-servicios`);
  }

  registerMatricula(data:Matricula):Observable<ResMatricula>{
    return this.http.post<ResMatricula>(`${environment.BASE_URL}/matricula/matricular-estudiante`, data);
  }

}
