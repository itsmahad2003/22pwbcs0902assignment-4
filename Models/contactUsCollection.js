import mongoose from 'mongoose';

const contactUsStructure = mongoose.Schema({
    reason: String,
    firstName: String,
    lastName: String,
    phoneNo: Number,
    email: String,
    comment: String
});

const contactUsModel = mongoose.model( 'ContactU', contactUsStructure );

export default contactUsModel;