const { response } = require('express')
const express = require('express')
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const _ = require('underscore')
const app = express()

app.post('/login', (req, res) => {
    let body = req.body
    Usuario.findOne({ email: body.email }, (err, usrDB) => {
        if (err)
            return res.status(500).json(responseError(err))
        if (!usrDB)
            return res.status(400).json(responseError({ err: 'Usuario o contraseña incorrectos' }))
        if (!bcrypt.compareSync(body.password, usrDB.password))
            return res.status(400).json(responseError({ err: 'Usuario o contraseña incorrectos' }))
        return res.json(responseOk([usrDB, {token: '123'}]))
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