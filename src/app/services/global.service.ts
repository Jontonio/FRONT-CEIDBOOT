import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResPerson } from '../class/Person';
import { ResCurso } from '../main/curso/class/Curso';
import { ResHorario } from '../main/grupo/class/Horario';
import { ResDenominServicio } from '../denomin-servicio/class/Denomin-servicio';
import { Matricula, ResMatricula } from '../main/matricula/class/Matricula';
import { ResApoderado } from '../main/matricula/class/Apoderado';
import { EmailDocumento, ResEmailDocEstudiante, ResEstudiante } from '../main/matricula/class/Estudiante';
import { ResGrupo } from '../main/grupo/class/Grupo';
import { EstudianteEnGrupo, ResEstudianteEnGrupo } from '../main/grupo/class/EstudianteGrupo';
import { FileDrive } from '../main/class/global';
import { Pago, ResPago } from '../main/grupo/class/Pago';
import { ResCategoriaPago } from '../main/grupo/class/CategoriaPago';

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

  getEstudiante(DNI:string):Observable<ResEstudiante>{
    return this.http.get<ResEstudiante>(`${environment.BASE_URL}/estudiante/get-estudiante-by-documento/${DNI}`);
  }

  getGruposMatricula():Observable<ResGrupo>{
    return this.http.get<ResGrupo>(`${environment.BASE_URL}/grupo/get-grupos-matricula`);
  }

  getDenominacionServicios():Observable<ResDenominServicio>{
    return this.http.get<ResDenominServicio>(`${environment.BASE_URL}/denomin-servicio/get-lista-denomin-servicios`);
  }

  getApoderado(DNI:string):Observable<ResApoderado>{
    return this.http.get<ResApoderado>(`${environment.BASE_URL}/apoderado/get-one-apoderado/${DNI}`);
  }

  getEmailDocEstudiante(data:EmailDocumento):Observable<ResEmailDocEstudiante>{
    return this.http.post<ResEmailDocEstudiante>(`${environment.BASE_URL}/estudiante/verify-documento-email`, data);
  }

  getCategoriaPago():Observable<ResCategoriaPago>{
    return this.http.get<ResCategoriaPago>(`${environment.BASE_URL}/categoria-pago/get-all-categoria-pago`);
  }

  consultaEstudianteGrupo(data:any):Observable<ResEstudianteEnGrupo>{
    return this.http.post<ResEstudianteEnGrupo>(`${environment.BASE_URL}/estudiante-en-grupo/consulta-estudiante-en-grupo`, data);
  }

  registerMatricula(data:EstudianteEnGrupo):Observable<ResEstudianteEnGrupo>{
    return this.http.post<ResEstudianteEnGrupo>(`${environment.BASE_URL}/estudiante-en-grupo/register-estudiante-from-matricula`, data);
  }

  registerPrematricula(data:Matricula):Observable<ResEstudianteEnGrupo>{
    return this.http.post<ResEstudianteEnGrupo>(`${environment.BASE_URL}/matricula/matricular-estudiante`, data);
  }

  uploadFile(data:FormData):Observable<FileDrive>{
    return this.http.post<FileDrive>(`${environment.BASE_URL}/matricula/upload-file`, data);
  }

  registerPago( data:Pago ):Observable<ResPago>{
    return this.http.post<ResPago>(`${environment.BASE_URL}/mensualidad/pago-mensualidad`, data);
  }


}
