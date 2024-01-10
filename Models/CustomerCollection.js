import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
const customerStructure = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String, 
    pass: String,
    confirmPass: String
});

//generating tokens
customerStructure.methods.generateAuthToken = async function(id){
    try {
        const token = jwt.sign({id:this._id}, process.env.SECRET_KEY);
        jwt.verify(token, process.env.SECRET_KEY);
        return token;
    } catch (error) {
        console.log("Error: " + error);
    }
}



const customerSignupModel = mongoose.model("Customer", customerStructure);

export default customerSignupModel;