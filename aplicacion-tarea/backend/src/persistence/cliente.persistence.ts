import { promises as fs } from 'fs';
import path from 'path';
import { Cliente } from '../models/cliente.model';

/**
 * =====================================================================
 * MÓDULO DE PERSISTENCIA - CLIENTES
 * =====================================================================
 * Responsabilidad ÚNICA de este módulo: leer y escribir el archivo
 * data/clientes.json. No conoce nada de rutas HTTP ni de Express;
 * por eso puede reutilizarse desde cualquier controlador.
 *
 * Archivo utilizado: backend/data/clientes.json
 * Formato interno: arreglo JSON de objetos Cliente. Ej:
 *   [
 *     { "codigoCliente": "C001", "nombreCliente": "Ana Pérez",
 *       "direccionCliente": "Zona 1, Ciudad", "telefonoCliente": "12345678" }
 *   ]
 * =====================================================================
 */

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const FILE_PATH = path.join(DATA_DIR, 'clientes.json');

/**
 * Garantiza que el archivo exista antes de operar sobre él.
 * Si no existe (primer uso de la aplicación), lo crea con un arreglo vacío.
 */
async function ensureFileExists(): Promise<void> {
  try {
    await fs.access(FILE_PATH);
  } catch {
    // ENOENT: el archivo no existe todavía
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE_PATH, '[]', 'utf-8');
  }
}

/**
 * Lee todos los clientes desde clientes.json.
 *
 * Errores que maneja:
 * - Archivo inexistente        -> se crea vacío y se retorna [].
 * - Archivo vacío (0 bytes)    -> se retorna [] sin lanzar excepción.
 * - Contenido no es un arreglo -> se registra el problema y se retorna [].
 * - JSON corrupto/mal formado  -> se captura el SyntaxError y se retorna [].
 * - Error de permisos (EACCES) -> se relanza como Error legible para la capa superior.
 */
export async function leerClientes(): Promise<Cliente[]> {
  try {
    await ensureFileExists();
    const contenido = await fs.readFile(FILE_PATH, 'utf-8');

    if (!contenido || contenido.trim().length === 0) {
      return [];
    }

    try {
      const data = JSON.parse(contenido);
      if (!Array.isArray(data)) {
        console.error('[persistencia] clientes.json no contiene un arreglo válido. Se retorna [].');
        return [];
      }
      return data as Cliente[];
    } catch (parseError) {
      console.error('[persistencia] JSON corrupto en clientes.json:', parseError);
      return [];
    }
  } catch (error: any) {
    console.error('[persistencia] Error de E/S al leer clientes.json:', error.message);
    throw new Error('No fue posible leer el archivo de clientes (revise permisos del disco).');
  }
}

/**
 * Escribe el arreglo completo de clientes en clientes.json.
 * Errores que maneja: fallos de escritura por permisos, disco lleno, etc.
 */
export async function guardarClientes(clientes: Cliente[]): Promise<void> {
  try {
    await ensureFileExists();
    const contenido = JSON.stringify(clientes, null, 2);
    await fs.writeFile(FILE_PATH, contenido, 'utf-8');
  } catch (error: any) {
    console.error('[persistencia] Error al escribir clientes.json:', error.message);
    throw new Error('No fue posible guardar los datos de clientes.');
  }
}

/**
 * Agrega un nuevo cliente, validando que el código no esté duplicado.
 */
export async function agregarCliente(cliente: Cliente): Promise<Cliente> {
  const clientes = await leerClientes();

  const existe = clientes.some(c => c.codigoCliente === cliente.codigoCliente);
  if (existe) {
    throw new Error(`Ya existe un cliente con el código ${cliente.codigoCliente}.`);
  }

  clientes.push(cliente);
  await guardarClientes(clientes);
  return cliente;
}

/**
 * Actualiza un cliente existente identificado por su código.
 */
export async function actualizarCliente(codigoCliente: string, datos: Partial<Cliente>): Promise<Cliente> {
  const clientes = await leerClientes();
  const index = clientes.findIndex(c => c.codigoCliente === codigoCliente);

  if (index === -1) {
    throw new Error(`No existe un cliente con el código ${codigoCliente}.`);
  }

  clientes[index] = { ...clientes[index], ...datos };
  await guardarClientes(clientes);
  return clientes[index];
}

/**
 * Elimina un cliente identificado por su código.
 */
export async function eliminarCliente(codigoCliente: string): Promise<void> {
  const clientes = await leerClientes();
  const nuevos = clientes.filter(c => c.codigoCliente !== codigoCliente);

  if (nuevos.length === clientes.length) {
    throw new Error(`No existe un cliente con el código ${codigoCliente}.`);
  }

  await guardarClientes(nuevos);
}
