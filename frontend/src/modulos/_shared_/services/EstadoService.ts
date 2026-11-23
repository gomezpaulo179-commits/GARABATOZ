//SERVICIO: el UNICO sitio donde se hacen peticiones http (siempre a NUESTRO nodejs, nunca a apis externas)
//   vista <----> controlador <----> SERVICIO <======> nodejs
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEstado } from '../models/IEstado';

@Injectable({ providedIn: 'root' })
export class EstadoService {
    private http = inject(HttpClient);

    //la url es relativa (/api/...) porque el proxy.conf.json la redirige a http://localhost:3000
    comprobarEstado(): Observable<IEstado> {
        return this.http.get<IEstado>('/api/estado');
    }
}
