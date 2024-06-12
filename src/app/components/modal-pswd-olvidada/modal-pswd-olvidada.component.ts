import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatLabel, MatFormField, MatFormFieldModule, MatFormFieldControl } from "@angular/material/form-field";
import { MatInputModule, MatInput } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-modal-pswd-olvidada',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-pswd-olvidada.component.html',
  styleUrl: './modal-pswd-olvidada.component.css'
})
export class ModalPswdOlvidadaComponent {

  // Servicios del componente
  #dialog: MatDialog = inject(MatDialog);
  #authService: AuthService = inject(AuthService);
  #snacBarService: SnackBarService = inject(SnackBarService);

  // Variables del componente
  reiniciarContraseniaForm: FormGroup = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
  });


  // Esta función se ejecuta al confirmar el correo al que reiniciarle la contraseña
  reiniciarContrasenia(){
    if(this.reiniciarContraseniaForm.value.correo == ""){
      console.log("El correo es necesario para poder reiniciar la contraseña");
      this.#snacBarService.openErrorSnackBar('El correo es necesario para poder reiniciar la contraseña');
    }else{
      console.log('Email de reinicio de cotraseña enviado');
      this.#snacBarService.openSuccessSnackBar('Email de reinicio de cotraseña enviado');
      this.#dialog.closeAll();
      this.#authService.fbResetPassword(this.reiniciarContraseniaForm.value.correo).then((msg) => {
        console.log(msg);
      });
    }
  }
}
