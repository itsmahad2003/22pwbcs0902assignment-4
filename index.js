import bodyParser from 'body-parser';
import cors from "cors";
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from './22pwbcs0902assignment-4/Routes/Customer.js';
import ProductData from './22pwbcs0902assignment-4/Routes/ProductData.js';
import Login from './22pwbcs0902assignment-4/Routes/Login.js';
import DeleteProduct from './22pwbcs0902assignment-4/Routes/DeleteProduct.js';
import jazzcashRoutes from "./22pwbcs0902assignment-4/Routes/Payment.js";

dotenv.config();

const app = express();

const url = process.env.MONGODB_URL;

const conection = mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true})

conection.then(() => {
    console.log("Successfully Connected to Database");
});

app.listen(5000);

app.use(cors());
app.use(bodyParser.json( { extended: true } ));
app.use(bodyParser.urlencoded( { extended: true } ));
app.use('/SignUp', Customer);
app.use('/Login', Login);
app.use('/', Customer);
app.use('/Login/ForgotPassword', Login);
app.use('/Admin/AddProduct', ProductData);
app.use('/Admin/ViewProduct',ProductData);
app.use('/images',express.static('images'));

app.use('/MenProduct', ProductData);
app.use('/WomenProduct', ProductData);
app.use('/CheckOut', ProductData);
// app.use('/Admin/ViewProduct/:id', ProductData);

app.use(express.json());
app.use("/Payment", jazzcashRoutes);