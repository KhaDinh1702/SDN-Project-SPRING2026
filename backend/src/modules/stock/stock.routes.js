import express from 'express';
import { Router } from 'express';

const stockRouter = Router();

//test GET /stock
stockRouter.get('/history', (req, res) => {
  res.json({ message: 'Lịch sử kho hàng' });
});

export default stockRouter;
