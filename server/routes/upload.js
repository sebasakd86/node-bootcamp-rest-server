const express = require('express')
let {
    verificarToken,
    verificaAdminRole
} = require('../middlewares/autenticacion')
const {
    responseError,
    responseOk
} = require('./responses')

const fileUpload = require('express-fileupload')
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')

let app = express()

app.use(fileUpload({
    useTempFiles: true
}));

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo
    let id = req.params.id

    if (!req.files)
        return res.status(400).json(responseError({
            msg: 'No hay archivos'
        }))
    let tiposValidos = ['productos', 'usuarios']
    if (!validarTipo(tiposValidos, tipo))
        return res.status(400).json(responseError({
            message: `Tipo de subida '${tipo}' no valida`
        }))

    let archivo = req.files.archivo
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']
    let nombreArchivo = archivo.name.split('.')
    let ext = nombreArchivo[nombreArchivo.length - 1]

    if (!validarTipo(extensionesValidas, ext))
        return res.status(400).json(responseError({
            message: `Extension de archivo '${ext}' no permitida`
        }))

    let archivoSubir = `${id}-${new Date().getMilliseconds()}-${archivo.name}`
    archivo.mv(`uploads/${tipo}/${archivoSubir}`, (err) => {
        if (!req.files)
            return res.status(500).json(responseError(err))
        if (tipo === 'usuarios')
            imagenUsuario(id, res, archivoSubir)
        else
            imagenProducto(id, res, archivoSubir)
    })
})

function imagenUsuario(idUsuario, res, nombreArchivo) {
    Usuario.findById(idUsuario, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json(responseError(err))
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(400).json(responseError({
                message: 'Usuario no existe'
            }))
        }

        borrarArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo
        usuarioDB.save((err, usuarioDB) => {
            if (err)
                return res.status(500).json(responseError(err))
            res.json(responseOk({
                usuarioDB
            }))
        })
    })
}

function imagenProducto(idProducto, res, nombreArchivo) {
    Producto.findById(idProducto, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(500).json(responseError(err))
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(400).json(responseError({
                message: 'Producto no existe'
            }))
        }
        borrarArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivo
        productoDB.save((err, productoDB) => {
            if (err)
                return res.status(500).json(responseError(err))
            res.json(responseOk({
                productoDB
            }))
        })
    })
}

function borrarArchivo(archivo, tipo) {
    if (archivo) {
        let p = path.resolve(__dirname, `../../uploads/${tipo}/${archivo}`)
        if (p) {
            if (fs.existsSync(p))
                fs.unlinkSync(p)
        }
    }
}
const validarTipo = (tiposValidos, entrada) => {
    return (tiposValidos.indexOf(entrada) >= 0)
}

module.exports = app