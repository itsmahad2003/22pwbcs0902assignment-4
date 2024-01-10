import express from 'express';
import { changePassword, getCustomer, sendOTPMail } from '../../Controllers/customerController.js';

const router = express.Router();

router.post("/", getCustomer );
router.post("/ForgotPassword", sendOTPMail );
router.put("/", changePassword);

export default router;