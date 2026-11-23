//CONTROLADOR: guarda el estado de la vista y la logica; NO hace peticiones http, se las pide al servicio
//   vista <----> CONTROLADOR <----> servicio <======> nodejs
import { Injectable, inject, signal } from '@angular/core';
import { EstadoService } from '../../../_shared_/services/EstadoService';

@Injectable()
export class InicioController {
    private estadoService = inject(EstadoService);

    //signals: variables "reactivas", cuando cambian la vista se repinta sola
    readonly cargando = signal<boolean>(true);
    readonly conectado = signal<boolean>(false);
    readonly mensaje = signal<string>('');

    comprobarServidor(): void {
        this.cargando.set(true);
        this.estadoService.comprobarEstado().subscribe({
            next: (respuesta) => {
                this.conectado.set(respuesta.ok);
                this.mensaje.set(respuesta.mensaje);
                this.cargando.set(false);
            },
            error: () => {
                this.conectado.set(false);
                this.mensaje.set('No hay conexion con el servidor de nodejs');
                this.cargando.set(false);
            }
        });
    }
}
