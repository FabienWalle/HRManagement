const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Pas de nom'],
    },
    SIRET: {
        type: Number,
        required: [true, "pas de SIRET"],
    },
    email: {
        type: String,
        required: [true, "pas d'e-mail"]
    },
    CEO: {
        type: String,
        required: [true, "pas de directeur"],
    },
    password: {
        type: String,
        required: [true, "pas de mot de passe"],
    },
    employees:{
        type:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "employees"
        }]
    }
})

const companyModel = mongoose.model('company', companySchema);
module.exports = companyModel;