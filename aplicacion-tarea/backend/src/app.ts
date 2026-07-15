import express from 'express';
import cors from 'cors';
import clienteRoutes from './routes/cliente.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', clienteRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});

export default app;
