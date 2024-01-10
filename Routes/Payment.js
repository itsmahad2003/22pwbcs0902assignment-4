import express from 'express';
import { JazzcashController } from '../../Controllers/Payment.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const paymentData = {
      pp_Amount: 1 * 100,
      pp_BillReference: 'billRef123',
      pp_Description: 'Test Payment',
      pp_MobileNumber: '03123456789',
      pp_CNIC: '345678',
    };

    JazzcashController.setData(paymentData);

    const response = await JazzcashController.createRequest('WALLET');
    const parsedResponse = JSON.parse(response);

    res.json(parsedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
