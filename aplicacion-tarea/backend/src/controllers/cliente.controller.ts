import { Request, Response } from 'express';
import { Cliente } from '../models/cliente.model';
import * as clientePersistence from '../persistence/cliente.persistence';

/**
 * Valida que el objeto recibido tenga los 4 campos obligatorios,
 * con el tipo correcto y sin valores vacíos, ANTES de persistir.
 */
function validarCliente(data: any): { valido: boolean; errores: string[] } {
  const errores: string[] = [];

  if (!data.codigoCliente || typeof data.codigoCliente !== 'string' || data.codigoCliente.trim() === '') {
    errores.push('El campo codigoCliente es obligatorio y debe ser texto no vacío.');
  }
  if (!data.nombreCliente || typeof data.nombreCliente !== 'string' || data.nombreCliente.trim() === '') {
    errores.push('El campo nombreCliente es obligatorio y debe ser texto no vacío.');
  }
  if (!data.direccionCliente || typeof data.direccionCliente !== 'string' || data.direccionCliente.trim() === '') {
    errores.push('El campo direccionCliente es obligatorio y debe ser texto no vacío.');
  }
  if (!data.telefonoCliente || typeof data.telefonoCliente !== 'string' || data.telefonoCliente.trim() === '') {
    errores.push('El campo telefonoCliente es obligatorio y debe ser texto no vacío.');
  }

  return { valido: errores.length === 0, errores };
}

export async function obtenerClientes(req: Request, res: Response): Promise<void> {
  try {
    const clientes = await clientePersistence.leerClientes();
    res.status(200).json(clientes);
  } catch (error: any) {
    res.status(500).json({ mensaje: 'Error al obtener los clientes.', error: error.message });
  }
}

export async function crearCliente(req: Request, res: Response): Promise<void> {
  const { valido, errores } = validarCliente(req.body);

  if (!valido) {
    res.status(400).json({ mensaje: 'Datos de cliente inválidos.', errores });
    return;
  }

  const cliente: Cliente = {
    codigoCliente: req.body.codigoCliente,
    nombreCliente: req.body.nombreCliente,
    direccionCliente: req.body.direccionCliente,
    telefonoCliente: req.body.telefonoCliente
  };

  try {
    const nuevo = await clientePersistence.agregarCliente(cliente);
    res.status(201).json(nuevo);
  } catch (error: any) {
    res.status(409).json({ mensaje: error.message });
  }
}

export async function actualizarCliente(req: Request, res: Response): Promise<void> {
  const { codigoCliente } = req.params;

  try {
    const actualizado = await clientePersistence.actualizarCliente(codigoCliente, req.body);
    res.status(200).json(actualizado);
  } catch (error: any) {
    res.status(404).json({ mensaje: error.message });
  }
}

export async function eliminarCliente(req: Request, res: Response): Promise<void> {
  const { codigoCliente } = req.params;

  try {
    await clientePersistence.eliminarCliente(codigoCliente);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ mensaje: error.message });
  }
}
