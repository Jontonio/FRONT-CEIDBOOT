import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Matricula } from "../class/Matricula";

@Injectable({
  providedIn:'root'
})
export class MatriculaService{

  constructor(private http:HttpClient){}

}
