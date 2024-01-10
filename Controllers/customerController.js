import customerSignupModel from '../Models/CustomerCollection.js';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

export const addCustomer = async (req, res) =>
{

    try {
        const firstName = req.body.firstName;
        const firstNameInStringFormat = firstName.toString();    

        const lastName = req.body.lastName;
        const lastNameInStringFormat = lastName.toString(); 

        const email = req.body.email;
        const emailInStringFormat = email.toString();
    
        const pass = req.body.pass;
        const passInStringFormat = pass.toString(); 

        const confirmPass = req.body.confirmPass;
        const confirmPassInStringFormat = confirmPass.toString(); 

        const newCustomer = new customerSignupModel({
            firstName: firstNameInStringFormat,
            lastName: lastNameInStringFormat,
            email: emailInStringFormat,
            pass: passInStringFormat,
            confirmPass: confirmPassInStringFormat
        });
        
        await newCustomer.save();
        res.json({response: true});

    } catch (error) {
        console.log("Not saved...", error);
        res.json({response: false});
    }
}

// export const addGoogleCustomer = async (req, res) =>
// {
//     const result = req.body;
//     console.log(result);
//     // const email = req.body.email;
//     // const password = req.body.pass;

//     // const newCustomer = new customerSignupModel({
//     //     email: email,
//     //     pass: password
//     // });

//     // try {
//     //     await newCustomer.save();
//     //     res.json(newCustomer);
//     // } catch (error) {
//     //     console.log("Not saved...", error);
//     // }
// }

export const getCustomer = async (req, res) =>
{
    const {email, password } = req.body; 
    console.log(email);  
    try {
        const customerLogin = await customerSignupModel.findOne({ email });
        
        const token = await customerLogin.generateAuthToken(customerLogin._id);

        if( customerLogin.pass === password )
        {
            const isAdmin = customerLogin.email === "admin@gmail.com";

            res.json({success: true, customerLogin, token, isAdmin});
        }
        else{
            res.json({success: false})
        }
    } catch (error) {
        console.log("Not found any data...");
        res.json({success: false});
    }
}

export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await customerSignupModel.findByIdAndDelete(id);

        if(result) {
            res.json({response: true});
        } else {
            res.json({response: false});
        }
    } catch (error) {
        console.log(error);
    }
}
    const CLIENT_ID = '870821543364-pmt96ioov75m4co707o3u471f0h6079k.apps.googleusercontent.com';
    const CLIENT_SECRET = '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';
    const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
    const REFERESH_TOKEN = '1//04zoKgvZUu7WSCgYIARAAGAQSNwF-L9Ir4CVJLxpeG7OS_94Lje41Dz4Zpdl6CisfJ45EB-edx8v6RldvonoOOwA4lo3xynln0h4';

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

    oAuth2Client.setCredentials({refresh_token: REFERESH_TOKEN});

export const sendOTPMail = async (req, res) => {

    try {
        const email = Object.keys(req.body)[0];
        console.log(email)

        const accessToken = await oAuth2Client.getAccessToken();
        const smtpConfig = {
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'abdulazizk1430@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFERESH_TOKEN,
                accessToken: accessToken
            }
        }
        const transporter = nodemailer.createTransport(smtpConfig);

        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log(otp);
        const mailOptions = {
            from: 'WATCHGALLERY <abdulazizk1430@gmail.com>',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`
        }

            await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error occurred while sending email:', error);
            } else {
              console.log('Email sent:', info.response);
              res.json(otp);
            }
          });

    } catch (error) {
        console.log(error);
    }
}
export const changePassword = async (req, res) => {
    try {
    const { email, password, cpassword } = req.body;
    console.log(email);
    const result = await customerSignupModel.findOne({email});

    if (result) {
        result.pass = password;
        result.confirmPass = cpassword;
        await result.save();
      } else {
        // Handle the case where the user is not found
        return res.status(404).json({ success: false, message: "User not found" });
      }      
    
    } catch (error) {
        
    }
}


















// const createToken = async () =>
// {
//     const token = await jwt.sign({_id:"648f3fa74a1d5b761f9d8f37"}, "mynameisabdulazizandiamastudent");

//     const userVarification = await jwt.verify(token, "mynameisabdulazizandiamastudent");
// }
// createToken();