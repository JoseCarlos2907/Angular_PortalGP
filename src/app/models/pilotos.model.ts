export class PilotosModel{

    constructor(
        public idPiloto: number,
        public imgPerfil: string,
        public nombre: string,
        public apellido: string,
        public fechaNac: string,
        public peso: number,
        public altura: number,
        public puntuacion: number,
    ){}
}
