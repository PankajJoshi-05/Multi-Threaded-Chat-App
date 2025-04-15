import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MailTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    }
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getEmailVerificationTemplate = (fileName, verificationCode) => {
   
    try {
        let template = fs.readFileSync(path.join(__dirname,"templates",fileName), "utf-8");
        return template.replace("{{verificationCode}}", verificationCode);
    } catch (error) {
        console.log("Error getting email-verifcation template");
        throw new Error(`Error getting email-verifcation template : ${error.message}`);
    }
}

const getWelcomeMessageTemplate=(filename,userName)=>{
    
    try {
        let template = fs.readFileSync(path.join(__dirname,"templates",filename), "utf-8");
        return template.replace("{{userName}}",userName);
    } catch (error) {
        console.log("Error getting email welcomeMessage template");
        throw new Error(`Error getting email welcomeMessage template : ${error.message}`);
    }
};

const getResetPasswordTemplate=(filename,resetURL)=>{
    try {
        let template = fs.readFileSync(path.join(__dirname,"templates",filename), "utf-8");
        return template.replace("{{resetURL}}",resetURL);
    } catch (error) {
        console.log("Error getting resetPassword template");
        throw new Error(`Error getting resetPassword template : ${error.message}`);
    }
}

const getResetSuccessTemplate=(filename)=>{
    try {
       return fs.readFileSync(path.join(__dirname,"templates",filename), "utf-8");
    } catch (error) {
        console.log("Error getting reset success template");
        throw new Error(`Error getting reset success template : ${error.message}`);
    }
}

export const sendVerificationEmail = async (email, verificationCode) => {
    try {
        const emailTemplate = getEmailVerificationTemplate("verification-email.html", verificationCode);
        await transporter.sendMail({
            from: `"Chat App" <no-reply@chatapp.com>`,
            to: email,
            subject: "Verify Your Email",
            html: emailTemplate
        });
        console.log(`verification email sent to : ${email}`);
    } catch (error) {
        console.log("Error sending verification code")
        throw new Error(`Error sending Verification code : ${error.message}`);
    }
};

export const sendWelcomeEmail=async(email,userName)=>{
    try{
      const emailTemplate=getWelcomeMessageTemplate("welcomeMessage.html",userName);
      await transporter.sendMail({
        from: `"Chat App" <no-reply@chatapp.com>`,
        to: email,
        subject: "Welcome Message",
        html: emailTemplate
      })
      console.log("wecome mail send to ",email);
    }catch(error){
        console.log("Error sending  welcome message");
        throw new Error(`Error sending  welcome message: ${error.message}`);
    }
};

export const sendPasswordResetEmail=async(email,resetURL)=>{
   try{
    const emailTemplate=getResetPasswordTemplate("resetPassword.html",resetURL);
   await transporter.sendMail({
    from: `"Chat App" <no-reply@chatapp.com>`,
    to: email,
    subject: "Reset Your Password",
    html: emailTemplate
   })
   }catch(error){
    console.log("Error sending resetPassword message");
    throw new Error(`Error sending resetPassword message: ${error.message}`);
   }
};

export const sendResetSuccessEmail=async(email)=>{
    try{
        const emailTemplate=getResetSuccessTemplate("resetSuccess.html");
       await transporter.sendMail({
        from: `"Chat App" <no-reply@chatapp.com>`,
        to: email,
        subject: "Reset Success",
        html: emailTemplate
       })
       }catch(error){
        console.log("Error sending reset success message");
        throw new Error(`Error sending reset success message: ${error.message}`);
       }
}