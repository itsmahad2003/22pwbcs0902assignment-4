import express from 'express';
import { deleteProduct } from '../../Controllers/productController.js';

const router = express.Router();

router.delete('/:id', deleteProduct);

export default router;