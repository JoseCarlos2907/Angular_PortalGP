import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  // Servicios del servicio
  #snackBar: MatSnackBar = inject(MatSnackBar);

  openSuccessSnackBar(message: string) {
    this.#snackBar.open(message, '', { 
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['successSB']
    });
  }

  openWarningSnackBar(message: string) {
    this.#snackBar.open(message, '', { 
      duration: 3000,
      verticalPosition: 'top' ,
      panelClass: ['warningSB']
    });
  }
  
  openErrorSnackBar(message: string) {
    this.#snackBar.open(message, '', { 
      duration: 3000,
      verticalPosition: 'top',
      panelClass: ['errorSB']
    });
  }
}
