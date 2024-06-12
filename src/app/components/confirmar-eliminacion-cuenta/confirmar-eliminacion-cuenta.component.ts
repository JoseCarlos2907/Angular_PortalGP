import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-confirmar-eliminacion-cuenta',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './confirmar-eliminacion-cuenta.component.html',
  styleUrl: './confirmar-eliminacion-cuenta.component.css'
})
export class ConfirmarEliminacionCuentaComponent {

  // Servicios del componente
  #dialog: MatDialog = inject(MatDialog);
  #router: Router = inject(Router);
  #authService: AuthService = inject(AuthService);
  #usuariosService: UsuariosService = inject(UsuariosService);
  #snacBarService: SnackBarService = inject(SnackBarService);
  
  // Variables del componente
  id!: string | null;

  deleteUserForm: FormGroup = new FormGroup({
    contrasenia: new FormControl('', Validators.required)
  });


  ngOnInit(){
    // Recojo el id del usuario del localstorage y lo asocio a una variable del componente
    this.id = localStorage.getItem('idUsuario');
  }

  // Esta función se ejecuta al cerrar la ventana cancelando la eliminación
  volver(){
    this.#dialog.closeAll();
  }

  // Esta es la función que se ejecuta al confirmar la eliminación del usuario, recogiendo el campo de la contraseña ya que es necesario para eliminar dicha cuenta en Firebase
  eliminar(){
    if(this.id != null){
      this.#usuariosService.borrarUsuarioPorId(this.id?.toString()).subscribe((msg) => {
        console.log(msg);
      });
    }
    this.#authService.fbDeleteUser(this.deleteUserForm.value.contrasenia);
    localStorage.clear();

    this.#dialog.closeAll();
    this.#snacBarService.openSuccessSnackBar('Se ha eliminado la cuenta de usuario');
    this.#router.navigate(['/home']);
  }
}
