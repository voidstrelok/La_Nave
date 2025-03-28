import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CapituloDTO } from '../model/DTO';

@Injectable({
  providedIn: 'root'
})
export class LaNaveAPIService {
  private readonly API_URL = environment.api+"lanave/capitulo/"

  constructor(private http: HttpClient) {}

  GetCapitulo(idCap:number) : Observable<CapituloDTO>
  {
    return this.http.get<CapituloDTO>(this.API_URL+"GetCapitulo?idCap="+idCap.toString())
  }

}
