export default class User {
  constructor(id, usuario, email, password, carrera = null, cuatrimestre = null) {
    this.id = id;
    this.usuario = usuario;
    this.email = email;
    this.password = password;
    this.carrera = carrera;
    this.cuatrimestre = cuatrimestre;
  }

  // Método auxiliar para convertir desde el objeto DB a la instancia
  static fromDB(row) {
    return new User(
      row.id,
      row.usuario,
      row.email,
      row.password,
      row.carrera,
      row.cuatrimestre
    );
  }
}