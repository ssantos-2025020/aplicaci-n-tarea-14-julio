/**
 * Entidad Cliente.
 *
 * Representa la estructura de un cliente tal como se modelaría
 * en una tabla de PostgreSQL. En esta actividad, sin embargo, la
 * persistencia real se realiza contra un archivo JSON (clientes.json)
 * usando fs/promises, tal como lo exige la actividad.
 *
 * Tabla equivalente en PostgreSQL (referencia de diseño):
 *
 *   CREATE TABLE clientes (
 *     codigo_cliente    VARCHAR(20)  PRIMARY KEY,
 *     nombre_cliente    VARCHAR(100) NOT NULL,
 *     direccion_cliente VARCHAR(150) NOT NULL,
 *     telefono_cliente  VARCHAR(20)  NOT NULL
 *   );
 *
 * Los 4 atributos obligatorios de la entidad son:
 *   - codigoCliente     (clave/identificador único del cliente)
 *   - nombreCliente
 *   - direccionCliente
 *   - telefonoCliente
 *
 * Nota: la estructura base no debe eliminarse; se pueden agregar
 * campos adicionales si el proyecto lo requiere (ej. correo, fechaRegistro).
 */
export interface Cliente {
  codigoCliente: string;
  nombreCliente: string;
  direccionCliente: string;
  telefonoCliente: string;
}
