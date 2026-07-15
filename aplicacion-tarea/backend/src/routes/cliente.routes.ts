import { Router } from 'express';
import * as clienteController from '../controllers/cliente.controller';

const router = Router();

router.get('/clientes', clienteController.obtenerClientes);
router.post('/clientes', clienteController.crearCliente);
router.put('/clientes/:codigoCliente', clienteController.actualizarCliente);
router.delete('/clientes/:codigoCliente', clienteController.eliminarCliente);

export default router;
