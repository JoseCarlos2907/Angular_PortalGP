export class ComentariosModel{

    constructor(
        public idPiloto: number,
        public idCircuito: number,
        public idCarrera: number,
        public comentario: string,
    ){}

}