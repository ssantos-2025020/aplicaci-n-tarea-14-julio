/**
 * Modelo Cliente (espejo del modelo definido en backend/src/models/cliente.model.ts).
 * Debe mantenerse sincronizado con la entidad del backend.
 */
export interface Cliente {
  codigoCliente: string;
  nombreCliente: string;
  direccionCliente: string;
  telefonoCliente: string;
}
