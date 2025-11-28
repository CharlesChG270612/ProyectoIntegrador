export default class Tendencia {
  constructor(id, titulo, subtitulo, tipo, miembros, porcentaje, imgSource) {
    this.id = id;
    this.titulo = titulo;
    this.subtitulo = subtitulo;
    this.tipo = tipo; // 'estudiante', 'tema', 'reto'
    this.miembros = miembros;
    this.porcentaje = porcentaje;
    this.imgSource = imgSource;
  }

  static fromDB(row) {
    return new Tendencia(
      row.id,
      row.titulo,
      row.subtitulo,
      row.tipo,
      row.miembros,
      row.porcentaje,
      row.img_source
    );
  }
}