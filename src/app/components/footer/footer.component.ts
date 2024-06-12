import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  // Servicios del componente
  #breakpointObserver: BreakpointObserver = inject(BreakpointObserver)

  // Variables del componente
  temaSeleccionado!: number;
  menor550px!: boolean

  ngOnInit(){
    // Recogemos el tema que tenga el usuario seleccionado para asociarlo al estilo de la página y si no está iniciado sesión se pone el predeterminado
    let tema = localStorage.getItem('temaSeleccionado');
    if(tema != null){
      this.temaSeleccionado = parseInt(tema);
    }else{
      this.temaSeleccionado = 0;
    }

    // Header segun ancho de pantalla
    this.#breakpointObserver.observe(['(max-width: 550px)']).subscribe((state: BreakpointState) => {
      if(state.matches){
        this.menor550px = true;
      }else{
        this.menor550px = false;
      }
    });
  }
}