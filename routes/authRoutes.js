const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');
require('dotenv').config();

//router.get('/home',(req,res)=>{
//    res.send("Hello World");
//})

//async function mailer(recieveremail, code){   //posible implementacion
   // console.log("Mailer function called");
//}

router.post('/verify',(req,res)=>{
    console.log('sent by client', req.body);
    const {email} = req.body;

    if(!email){
        return res.status(422).json({error: "Porfavor llena todos los campos"});
    }
    User.findOne({ email: email }).then(
        (savedUser) => {
            if(savedUser){
                return res.status(422).json({error: "Credenciales invalidas"});
            }
        }
    )     
    
})

router.post('/changeusername', (req,res) => {
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

module.exports = router;