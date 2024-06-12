export class ResultadosClasificacionesModel{

    constructor(
        public idPiloto: number,
        public idClasificacion: number,
        public tiempoVueltaMasRapida: string,
        public posicionFinal: number,
    ){}
}
