import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PortalGP';

  temaSeleccionado!: number;

  ngOnInit(){
    let tema = localStorage.getItem('temaSeleccionado');
    if(tema != null){
      this.temaSeleccionado = parseInt(tema);
    }else{
      this.temaSeleccionado = 0;
    }
    // this.temaSeleccionado = 4;
  }
}
