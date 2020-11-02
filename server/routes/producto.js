const express = require('express')
let {
    verificarToken,
    verificaAdminRole
} = require('../middlewares/autenticacion')
let app = express()
let Producto = require('../models/producto')

app.get('/producto/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino
    let regex = new RegExp(termino, 'i')
    let productosBuscar = {
        nombre: regex
    }
    let dsd = Number(req.query.desde) || 0
    let tamPagina = Number(req.query.limite) || 5
    Producto.find(productosBuscar) //, '')
        .skip(dsd)
        .limit(tamPagina)
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err)
                return res.status(400).json(responseError(err))
            Producto.countDocuments(productosBuscar, (err, cant) => {
                if (err)
                    return res.status(400).json(responseError(err))
                return res.json(responseOk({
                    productoDB,
                    conteo: cant
                }))
            })
        })
})

app.get('/producto', verificarToken, (req, res) => {
    //traer todos los productos populando el usuario y categoria, paginado
    let productosActivos = {
        disponible: true
    }
    let dsd = Number(req.query.desde) || 0
    let tamPagina = Number(req.query.limite) || 5
    Producto.find(productosActivos) //, '')
        .skip(dsd)
        .limit(tamPagina)
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err)
                return res.status(400).json(responseError(err))
            Producto.countDocuments(productosActivos, (err, cant) => {
                if (err)
                    return res.status(400).json(responseError(err))
                return res.json(responseOk({
                    productoDB,
                    conteo: cant
                }))
            })
        })
})
app.get('/producto/:id', verificarToken, (req, res) => {
    //producto populando el usuario y categoria
    let id = req.params.id
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, categoriaDB) => {
            if (err)
                return res.status(400).json(responseError(err))
            return res.json(responseOk(categoriaDB))
        })
})
app.post('/producto/', verificarToken, (req, res) => {
    //todo validar que exista la categoria (viene por id o nombre)
    let body = req.body
    let p = Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    })
    p.save((err, prodDB) => {
        if (err)
            return res.status(400).json(responseError(err))
        return res.json(responseOk(prodDB))
    })
})
app.put('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id
    let body = req.body
    let desc = {
        descripcion: body.descripcion,
        nombre: body.nombre,
        precioUni: body.precioUni,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    }
    Producto.findByIdAndUpdate(id, desc, {
        new: true,
        runValidators: true,
        context: 'query'
    }, (err, prodDB) => {
        if (err)
            return res.status(400).json(responseError(err))
        res.json(responseOk(prodDB))
    })
})
app.delete('/producto/:id', [verificarToken], (req, res) => {
    //disponible = false
    let id = req.params.id
    Producto.findByIdAndUpdate(id, {
        disponible: false
    }, (err, prodDB) => {
        if (err)
            return res.status(400).json(responseError(err))
        return res.json(responseOk(prodDB))
    })
})

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