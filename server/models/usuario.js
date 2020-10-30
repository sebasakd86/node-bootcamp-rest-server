const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '\'{VALUE}\' no es un rol valido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio!']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio!'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio!']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado :{
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

usuarioSchema.methods.toJSON = function() {
    let u = this
    let uObj = u.toObject()
    delete uObj.password
    return uObj
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser unico'
})

module.exports = mongoose.model('Usuario', usuarioSchema)