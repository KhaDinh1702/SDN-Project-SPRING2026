import { Router } from 'express';
import aiController from './ai.controller.js';

const aiRouter = Router();

aiRouter.post('/suggest', aiController.suggestFood);

export default aiRouter;
