import { Component, Input, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BuscarService } from '../../services/buscar.service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { BarraBusquedaComponent } from '../barra-busqueda/barra-busqueda.component';
import { HeaderSmComponent } from '../header-sm/header-sm.component';
import { SidebarModule } from 'primeng/sidebar';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    BarraBusquedaComponent,
    HeaderSmComponent,

    MatAutocompleteModule,
    MatIconModule,
    MatOptionModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    SidebarModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  // Servicios del componente
  #actRoute: ActivatedRoute = inject(ActivatedRoute); 
  #breakpointObserver: BreakpointObserver = inject(BreakpointObserver)

  // Variables del ocmponente
  temaSeleccionado!: number;
  comeFromReg!: string;
  resultadosFiltrados!: Array<any>;

  searchForm: FormGroup = new FormGroup({
    value: new FormControl('', [Validators.required]),
  });

  comprobanteAnchoPantalla: boolean = true;
  menor600px!: boolean;


  ngOnInit(){
    // Recogemos el tema que tenga el usuario seleccionado para asociarlo al estilo de la página y si no está iniciado sesión se pone el predeterminado
    let tema = localStorage.getItem('temaSeleccionado');
    if(tema != null){
      this.temaSeleccionado = parseInt(tema);
    }else{
      this.temaSeleccionado = 0;
    }


    // Header segun ancho de pantalla
    this.#breakpointObserver.observe([
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      let breakpoints = result.breakpoints;

      if(breakpoints[Breakpoints.Small]){
        this.menor600px = true;
        this.comprobanteAnchoPantalla = true;
      }else if(breakpoints[Breakpoints.Medium]){
        this.menor600px = false;
        this.comprobanteAnchoPantalla = true;
      }else if(breakpoints[Breakpoints.Large] || breakpoints[Breakpoints.XLarge]){
        this.menor600px = false;
        this.comprobanteAnchoPantalla = false;
      }
    });

    let cfr = this.#actRoute.snapshot.params['reg'];
    this.comeFromReg = cfr; 

    if(cfr == 'true'){
      window.scrollTo(0, 0);
    }
  }
}
