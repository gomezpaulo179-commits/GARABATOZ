//VISTA: solo pinta lo que tiene el controlador
//   VISTA <----> controlador <----> servicio <======> nodejs
import { Component, OnInit, inject } from '@angular/core';
import { InicioController } from '../../controllers/InicioController';

@Component({
  selector: 'app-inicio',
  imports: [],
  providers: [InicioController], // <-- cada vista tiene su propia instancia del controlador
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  protected ctrl = inject(InicioController);

  ngOnInit(): void {
    this.ctrl.comprobarServidor();
  }
}
