import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, first } from 'rxjs';
import { environment } from '../../environments/enviroment';
import { UsuariosModel } from '../models/usuarios.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    // Servicios Inyectados
    #httpClient: HttpClient = inject(HttpClient);
    #afAuth: AngularFireAuth = inject(AngularFireAuth);

    // Metodos de Firebase
  async fbLogin(correo: string, contrasenia: string): Promise<any>{
    try {
      const result = await this.#afAuth.signInWithEmailAndPassword(correo, contrasenia);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }


  async fbRegister(correo: string, contrasenia: string){
    try {
      const result = await this.#afAuth.createUserWithEmailAndPassword(correo, contrasenia);
      this.fbSendVerificationEmail();
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async fbLogout(){
    try {
      const result = await this.#afAuth.signOut();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async fbResetPassword(correo: string){
    try {
      const result = await this.#afAuth.sendPasswordResetEmail(correo);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async fbSendVerificationEmail(): Promise<void>{
    return (await this.#afAuth.currentUser)?.sendEmailVerification();
  }

  async fbUserCredentials(){
    return this.#afAuth.authState.pipe(first()).toPromise();
  }

  async fbIsUserVerified(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.#afAuth.authState.subscribe(user => {
        if (user) {
          resolve(user.emailVerified);
        } else {
          resolve(false);
        }
      }, error => reject(error));
    });
  }

  async fbUserEmail(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.#afAuth.authState.subscribe(user => {
        if (user) {
          resolve(user.email);
        } else {
          resolve(null);
        }
      }, error => reject(error));
    });
  }

  async fbChangePassword(contraseniaAntigua: string, contraseniaNueva: string){
    this.#afAuth.currentUser.then(user => {
      if (user) {
        const credentials = firebase.auth.EmailAuthProvider.credential(user.email!, contraseniaAntigua);
        user.reauthenticateWithCredential(credentials).then(() => {
          user.updatePassword(contraseniaNueva).then(() => {
            console.log('Contraseña cambiada exitosamente');
          });
        });
      }
    });
  }

  async fbCurrentUser(){
    await this.#afAuth.currentUser;
  }


  async fbDeleteUser(contrasenia: string){
    this.#afAuth.currentUser.then(user => {
      if (user) {
        const credentials = firebase.auth.EmailAuthProvider.credential(user.email!, contrasenia);
        user.reauthenticateWithCredential(credentials).then(() => {
          user.delete().then(() => {
            console.log('Usuario eliminado correctamente');
          });
        });
      }else{
        console.log('No hay ningún usuario iniciado sesión');
      }
    });
  }
}