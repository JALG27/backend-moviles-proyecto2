const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.mongo_URL).then(
    ()=>{
        console.log('Conectado a la base de datos');
    }
).catch((err)=>{
    console.log('Error conectando a la base de datos' + err);
})