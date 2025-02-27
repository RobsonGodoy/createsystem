import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middlewares/auth.middleware';
import Site from '../models/Site';
import { BuildService } from '../services/buildService';
import path from 'path';

const router = Router();

// Middleware de autenticação para todas as rotas
router.use(authMiddleware);

const siteSchema = z.object({
  name: z.string().min(3),
  layout: z.array(z.object({
    type: z.string(),
    props: z.record(z.any()),
    id: z.number(),
    layout: z.object({
      width: z.string().optional(),
      newRow: z.boolean().optional(),
      padding: z.number().optional()
    }).optional()
  })),
});

// Criar novo site
router.post('/', async (req, res) => {
  try {
    const { name, layout } = siteSchema.parse(req.body);
    const site = await Site.create({
      name,
      layout,
      userId: req.user!.id,
    });

    return res.status(201).json(site);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Listar sites do usuário
router.get('/', async (req, res) => {
  try {
    const sites = await Site.findAll({
      where: { userId: req.user!.id },
      order: [['createdAt', 'DESC']],
    });

    return res.json(sites);
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter site específico
router.get('/:id', async (req, res) => {
  try {
    const site = await Site.findOne({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!site) {
      return res.status(404).json({ message: 'Site não encontrado' });
    }

    return res.json(site);
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar site
router.put('/:id', async (req, res) => {
  try {
    const { name, layout } = siteSchema.parse(req.body);
    
    const site = await Site.findOne({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!site) {
      return res.status(404).json({ message: 'Site não encontrado' });
    }

    await site.update({ name, layout });

    return res.json(site);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Excluir site
router.delete('/:id', async (req, res) => {
  try {
    const site = await Site.findOne({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!site) {
      return res.status(404).json({ message: 'Site não encontrado' });
    }

    await site.destroy();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Publicar site
router.post('/:id/publish', async (req, res) => {
  try {
    const site = await Site.findOne({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!site) {
      return res.status(404).json({ message: 'Site não encontrado' });
    }

    const buildPath = await BuildService.buildSite(site);
    
    await site.update({
      isPublished: true,
      buildPath: `/builds/${path.basename(buildPath)}`,
    });

    return res.json(site);
  } catch (error) {
    console.error('Erro ao publicar site:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router; 