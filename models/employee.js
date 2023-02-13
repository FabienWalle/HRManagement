const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "pas de prénom"]
    },
    lastname: {
        type: String,
        required: [true, "pas de nom"]
    },
    image: {
        type: String,
        required: [true, "pas de photo"]
    },

    role: {
        type: String,
        required: [true, "pas de métier"]
    },

    blame: {
        type: Number,
        default: 0
    }
})

const employeeModel = mongoose.model('employees', employeeSchema);
module.exports = employeeModel;