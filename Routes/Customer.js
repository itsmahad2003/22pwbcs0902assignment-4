import express from 'express';
import { addCustomer, deleteCustomer, getCustomer } from '../../Controllers/customerController.js';
const router = express.Router();

router.post("/", addCustomer);
router.delete('/:id', deleteCustomer);
// router.post("/SignUp/Google", addGoogleCustomer);
// router.post("/Login", getCustomer);

export default router;