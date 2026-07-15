<<<<<<< HEAD
# Aplicación Tarea — Gestión de Clientes

Módulo de persistencia con JSON y `fs/promises` (backend) + interfaz Angular (frontend).

## Estructura del proyecto

```
aplicacion-tarea
├── backend
│   ├── src
│   │   ├── controllers      -> validación de entrada y orquestación HTTP
│   │   ├── models           -> entidad Cliente (mirror de tabla PostgreSQL)
│   │   ├── persistence      -> ÚNICO módulo que toca clientes.json
│   │   ├── routes           -> definición de endpoints REST
│   │   └── app.ts           -> punto de entrada de Express
│   ├── data
│   │   └── clientes.json    -> archivo de persistencia (arreglo JSON)
│   ├── package.json
│   └── tsconfig.json
└── frontend
    └── src
        ├── app
        │   ├── components
        │   │   ├── cliente-form   -> formulario de ingreso de clientes
        │   │   └── cliente-list   -> tabla de clientes existentes
        │   ├── models             -> espejo del modelo del backend
        │   ├── services           -> ClienteService (HttpClient)
        │   └── app.component.*
        ├── main.ts
        └── index.html
        angular.json
```

## Entidad Cliente

Los 4 atributos obligatorios (no se eliminan, solo se pueden agregar más si el proyecto lo requiere):

| Atributo           | Tipo TS  | Equivalente PostgreSQL           |
|---------------------|----------|-----------------------------------|
| `codigoCliente`     | string   | `codigo_cliente VARCHAR(20) PK`   |
| `nombreCliente`     | string   | `nombre_cliente VARCHAR(100)`     |
| `direccionCliente`  | string   | `direccion_cliente VARCHAR(150)`  |
| `telefonoCliente`   | string   | `telefono_cliente VARCHAR(20)`    |

DDL de referencia:

```sql
CREATE TABLE clientes (
  codigo_cliente    VARCHAR(20)  PRIMARY KEY,
  nombre_cliente    VARCHAR(100) NOT NULL,
  direccion_cliente VARCHAR(150) NOT NULL,
  telefono_cliente  VARCHAR(20)  NOT NULL
);
```

> Nota: la actividad pide persistencia sobre archivos JSON con `fs/promises`,
> por lo que el modelo se diseñó como si fuera una tabla de PostgreSQL, pero
> la escritura/lectura real ocurre contra `backend/data/clientes.json`.

## Cómo funciona el módulo de persistencia

Archivo: `backend/src/persistence/cliente.persistence.ts`.
Es el ÚNICO módulo que abre o escribe `clientes.json`; ningún controlador
accede al archivo directamente (separación de responsabilidades).

Funciones expuestas:

- **`leerClientes()`**: abre `clientes.json` con `fs.readFile` (asíncrono).
  Si el archivo no existe, lo crea vacío (`[]`). Si el contenido está vacío
  o el JSON es inválido, retorna un arreglo vacío en lugar de detener la
  aplicación.
- **`guardarClientes(clientes)`**: serializa el arreglo completo con
  `JSON.stringify` y lo escribe con `fs.writeFile` (asíncrono).
- **`agregarCliente(cliente)`**: valida que el `codigoCliente` no esté
  duplicado, agrega el registro y persiste el arreglo completo.
- **`actualizarCliente(codigo, datos)`** / **`eliminarCliente(codigo)`**:
  localizan el registro por código y actualizan el archivo.

## Manejo de errores

| Escenario                                   | Manejo                                                        |
|----------------------------------------------|----------------------------------------------------------------|
| Archivo `clientes.json` no existe             | Se crea automáticamente con `[]` (no se lanza excepción).      |
| Archivo vacío (0 bytes)                       | Se retorna `[]`.                                                |
| Contenido no es un arreglo JSON válido        | Se registra el problema en consola y se retorna `[]`.          |
| JSON corrupto / mal formado                   | Se captura el `SyntaxError` del `JSON.parse` y se retorna `[]`. |
| Error de permisos / E/S al leer o escribir    | Se captura, se registra y se relanza como `Error` legible que el controlador traduce a HTTP 500. |
| Datos con campos faltantes o vacíos           | El controlador valida antes de llamar a la persistencia y responde HTTP 400 sin escribir nada. |
| Código de cliente duplicado                   | `agregarCliente` lanza error controlado -> HTTP 409.           |
| Código de cliente inexistente (update/delete) | Se lanza error controlado -> HTTP 404.                          |

Todas las operaciones de E/S están envueltas en bloques `try/catch`.

## Endpoints del backend

| Método | Ruta                          | Descripción              |
|--------|-------------------------------|--------------------------|
| GET    | `/api/clientes`                | Lista todos los clientes |
| POST   | `/api/clientes`                | Crea un cliente          |
| PUT    | `/api/clientes/:codigoCliente` | Actualiza un cliente     |
| DELETE | `/api/clientes/:codigoCliente` | Elimina un cliente       |

## Escenarios de prueba sugeridos

1. **Escritura válida**: POST con los 4 campos completos -> se agrega a
   `clientes.json` y responde 201.
2. **Validación de campos**: POST sin `telefonoCliente` -> responde 400
   con el detalle del campo faltante; el archivo no se modifica.
3. **Código duplicado**: POST con un `codigoCliente` ya existente ->
   responde 409, el archivo no se modifica.
4. **Lectura con archivo vacío**: vaciar `clientes.json` (dejar `""`) y
   hacer GET -> responde `[]` sin error.
5. **Lectura con archivo corrupto**: escribir texto no-JSON en
   `clientes.json` y hacer GET -> el módulo detecta el `SyntaxError` y
   responde `[]` (la aplicación no se detiene).
6. **Actualizar/eliminar cliente inexistente**: PUT/DELETE con un código
   que no existe -> responde 404.

## Cómo ejecutar

Este proyecto usa **pnpm** exclusivamente como gestor de paquetes (no `npm`
ni `yarn`). Si no lo tienes instalado:

```bash
npm install -g pnpm
```

Backend:
```bash
cd backend
pnpm install
pnpm run dev
```

Frontend:
```bash
cd frontend
pnpm install
pnpm start
```

El frontend consume la API en `http://localhost:3000/api/clientes`
(definido en `frontend/src/app/services/cliente.service.ts`).
=======
# aplicaci-n-tarea-14-julio
>>>>>>> c85e01442bfca59c112805b773dc29e537db8773
