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

  //letras del titulo en grafiti: cada una con su giro (grados) y su subida (em)
  //para que no queden rectas como un texto normal. Es algo solo visual, por eso va en la vista y no en el controlador
  protected readonly letrasTitulo = [
    { letra: 'G', giro: -8, subida: 0.05 },
    { letra: 'A', giro: 6,  subida: -0.10 },
    { letra: 'R', giro: -4, subida: 0.08 },
    { letra: 'A', giro: 9,  subida: -0.05 },
    { letra: 'B', giro: -6, subida: 0.10 },
    { letra: 'A', giro: 5,  subida: -0.08 },
    { letra: 'T', giro: -9, subida: 0.04 },
    { letra: 'O', giro: 7,  subida: -0.10 },
    { letra: 'Z', giro: -5, subida: 0.06 },
  ];

  ngOnInit(): void {
    this.ctrl.comprobarServidor();
  }
}
