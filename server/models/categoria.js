const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
let categoriaSchema =
    new Schema({
        descripcion: {
            type: String,
            unique: true,
            required: [true, 'La descripción es obligatoria']
        },
        usuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    });
categoriaSchema.plugin(uniqueValidator);    
module.exports = mongoose.model('Categoria', categoriaSchema);