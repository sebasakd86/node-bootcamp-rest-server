const express = require('express')
let {
    verificarToken,
    verificaAdminRole
} = require('../middlewares/autenticacion')
let app = express()
let Categoria = require('../models/categoria')

app.get('/categoria', verificarToken, (req, res) => {
    Categoria.find({}, 'descripcion usuario')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err)
                return res.status(400).json(responseError(err))
            Categoria.countDocuments({}, (err, cant) => {
                if (err)
                    return res.status(400).json(responseError(err))
                return res.json(responseOk({
                    categoriaDB,
                    conteo: cant
                }))
            })
        })
}) //todas las categorias, sin paginar
app.get('/categoria/:id', verificarToken, (req, res) => { //solo info de la categoria
    let id = req.params.id
    Categoria.findById(id, 'descripcion usuario')
        .exec((err, categoriaDB) => {
            if (err)
                return res.status(400).json(responseError(err))
            return res.json(responseOk(categoriaDB))
        })
})
app.post('/categoria', verificarToken, (req, res) => {
    // console.log(req.usuario)
    let body = req.body
    let cat = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })
    cat.save((err, catDB) => {
        if (err)
            return res.status(400).json(responseError(err))
        return res.json(responseOk(catDB))
    })
}) //crea una nueva categoria
app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id
    let body = req.body
    let desc = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, desc, {
        new: true,
        runValidators: true,
        context: 'query'
    }, (err, catDB) => {
        if (err)
            return res.status(400).json(responseError(err))
        res.json(responseOk(catDB))
    })
}) //actualizar nombre de la categoria
app.delete('/categoria/:id', [verificarToken, verificaAdminRole], (req, res) => {
    let id = req.params.id
    Categoria.findByIdAndRemove(id, (err, catBorrada) => {
        if (err)
            return res.status(400).json(responseError(err))
        if (!catBorrada)
            return res.status(400).json(responseError({
                msg: 'Categoria no encontrada'
            }))
        res.json(responseOk(catBorrada))
    })
}) //solo un admin puede borrar, se BORRA de prepo

const responseError = (err) => {
    return {
        ok: false,
        err
    }
}
const responseOk = (obj) => {
    return {
        ok: true,
        obj
    }
}

module.exports = app