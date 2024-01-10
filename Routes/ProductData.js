import express from 'express';
import { addProduct, getProducts, getProductById, getProductByCategory, deleteProduct, UpdateProduct } from '../../Controllers/productController.js';
import multer from 'multer';

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images/'); // Set the destination folder where you want to store the images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Set the filename for the uploaded image
  },
});


const upload = multer({ storage: storage });

router.post('/',upload.single('image'), addProduct);

router.get("/",getProducts);

router.post("/category",getProductByCategory);

router.get("/:id", getProductById);

router.delete("/:productId", deleteProduct);

router.put("/:id", UpdateProduct);
export default router;