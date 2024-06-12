export class UsuariosModel{

    constructor(
        public imgPerfil: string | null,
        public nombre: string | null,
        public apellidos: string | null,
        public fechaNac: string | null,
        public nombreUsuario: string | null,
        public correo: string | null,
        public rol: string | null,
        public temaSeleccionado?: number | null,
        public idUsuario?: number,
    ){}

}