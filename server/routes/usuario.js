const { response } = require('express')
const express = require('express')
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const _ = require('underscore')
const app = express()

app.get('/usuario', function (req, res) {
    let dsd = Number(req.query.desde) || 0
    let tamPagina = Number(req.query.limite) || 5
    Usuario.find({}, 'nombre email estado google role img')
        .skip(dsd)
        .limit(tamPagina)
        .exec((err, usrsDB) => {
            if (err)
                return res.status(400).json(responseError(err))
            Usuario.countDocuments({}, (err, cant) => {
                if(err)
                    return res.status(400).json(responseError(err))
                return res.json(responseOk({usrsDB, conteo: cant}))
            })
            
        })
})
app.post('/usuario', function (req, res) {
    let body = req.body
    let usr = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })
    usr.save((err, usrDB) => {
        if (err)
            return res.status(400).json(responseError(err))
        return res.json(responseOk(usrDB))
    })
})
app.put('/usuario/:id', function (req, res) {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'img', 'email', 'role', 'estado'])

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usrDB) => {
        if (err)
            return res.status(400).json(responseError(err))
        res.json(responseOk(usrDB))
    })
})
app.delete('/usuario', function (req, res) {
    res.json('delete')
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