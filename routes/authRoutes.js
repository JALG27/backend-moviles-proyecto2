const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require("nodemailer");

//router.get('/home',(req,res)=>{
//    res.send("Hello World");
//})

async function mailer(recieveremail, code){   
    //console.log("Mailer function called");
    let transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port: 587,

        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.NodeMailer_email,
            pass: process.env.NodeMailer_pass,
        },
    });

    let info = await transporter.sendMail({
        from: "Twitter",
        to: `${recieveremail}`,
        subject: "Verificacion de Email",
        text: `Tu codigo de verificacion es ${code}`,
        html: `<b>Tu codigo de verificacion es ${code}</b>`,
    })

    console.log("Mensaje enviado: %s", info.messageId);
    console.log("URL anterior: %s", nodemailer.getTestMessageUrl(info));
}

router.post('/verify',(req,res)=>{
    //console.log('sent by client', req.body);
    const {email} = req.body;

    if(!email){
        return res.status(422).json({error: "Porfavor llena todos los campos"});
    }
    else {
    User.findOne({ email: email })
    .then(async (savedUser) => {
        //console.log(savedUser);
        //return res.status(200).json({error: "Email Enviado"});
        if(savedUser){
            return res.status(422).json({error: "Credenciales invalidas"});
        }
        try{
            let VerificationCode = Math.floor(100000 + Math.random() * 900000)
            await mailer(email,VerificationCode);

            return res.status(200).json({message: "Email enviado", VerificationCode, email});

        }
        catch(err){}
        })
    }
})
            
     

/*router.post('/changeusername', (req,res) => {
    const { username, email } = req.body;
    User.find({username}).then(async (savedUser) => {
        if(savedUser.length > 0){
            return res.status(422).json({error: "Username ya existe"});

        }
        else {
            return res.status(200).json({ message: "Username Disponible", username, email });
        }


    })
        
})

router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(422).json({ error: "Porfavor llenar todos los campos"});
    }
    else {
        const user = new User({
            username,
            email,
            password,
        })

        try {
            await user.save();
            const token = jwt.sign({_id : user._id}, process.env.JWT_SECRET);
            return res.status(200).json({ message: "Usuario registrado Exitosamente", token });
        }
        catch (err) {
            console.log(err);
            return res.status(422).json({ error: "Usuario no registrado" });
        }
    }
})
*/
module.exports = router;