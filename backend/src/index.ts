import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import authRoutes from './routes/auth.routes';
import siteRoutes from './routes/site.routes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/sites', siteRoutes);

// Conexão com o banco de dados
sequelize.sync()
  .then(() => {
    console.log('Banco de dados conectado com sucesso');
  })
  .catch((error) => {
    console.error('Erro ao conectar com o banco de dados:', error);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 