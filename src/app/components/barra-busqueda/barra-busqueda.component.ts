import { Component, Input, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BuscarService } from '../../services/buscar.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-barra-busqueda',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatIconModule,
    MatOptionModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './barra-busqueda.component.html',
  styleUrl: './barra-busqueda.component.css'
})
export class BarraBusquedaComponent {

  // Servicios del componente
  #router: Router = inject(Router);
  #buscarService: BuscarService = inject(BuscarService);


  // Variables del componente
  resultadosFiltrados: Array<any> = [];
  
  searchForm: FormGroup = new FormGroup({
    value: new FormControl('', [Validators.required]),
  });



  ngOnInit(){
    // Se recogen las búsquedas predeterminadas para la primera vez que se cargue en la página
    this.#buscarService.getBusqueda("").subscribe({
      next: (resultados: any) => {
        this.resultadosFiltrados = resultados;
      },
      
      error: console.log
    });
  }

  // Esta función se ejecuta cada vez que pulsas una tecla y la levantas, lo que hace es efectuar una nueva búsqueda con el texto que haya en el campo
  onKeyup($event: Event) {
    let eventTarget = $event.target as HTMLInputElement;

    this.#buscarService.getBusqueda(eventTarget.value.toLowerCase()).subscribe({
      next: (resultados: any) => {
        this.resultadosFiltrados = resultados;
      },
      
      error: console.log
    });
  }

  // La siguiente función se ejecuta cuando le das click a una de las opciones del desplegable que sale, lo que hace es redirigirte a la página de la opción que clicke
  opcionSeleccionada(){
    let resultado = this.resultadosFiltrados.find((res) => res.nombre == this.searchForm.value.value || res.nombre == this.searchForm.value.value.split(" ")[0] || res.nombreUsuario == this.searchForm.value.value);
    
    // Se comprueba el tipo y dependiendo del tipo te reenvía al perfil de un piloto, de un usuario o a los detalles de una escudería
    switch(resultado.tipo){
      case 'piloto':
        this.#router.navigate([`/perfil-piloto/${resultado.idPiloto}`]);
        break;
      
      case 'usuario':
        this.#router.navigate([`/usuario-ajeno/${resultado.idUsuario}`]);
        break;
      
      case 'escuderia':
        this.#router.navigate([`/perfil-escuderia/${resultado.idEscuderia}`]);
    
        break;
    }
  }
}
