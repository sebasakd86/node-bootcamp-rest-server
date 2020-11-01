const { response } = require('express')
const express = require('express')
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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

        let token = jwt.sign({
            usuario: usrDB
        }, process.env.SEED_TOKEN
            , { expiresIn: process.env.CADUCIDAD_TOKEN })
        // console.log(token)
        return res.json(responseOk([usrDB, { token }]))
    })
})

//Google CFG
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
// verify().catch(console.error);

app.post('/google', async (req, res) => {
    let token = req.body.idtoken
    let gUser =
        await verify(token)
            .catch(e => {
                return res.status(403).json(responseError(e))
            })

    Usuario.findOne({ email: gUser.email }, (err, userDB) => {
        if (err)
            return res.status(500).json(responseError(err))
        if (userDB) {
            if (!userDB.google) {
                return res.status(400).json(responseError({ msg: 'Debe de usar su autenticacion normal' }))
            } else {
                let token = jwt.sign({
                    usuario: userDB
                }, process.env.SEED_TOKEN
                    , { expiresIn: process.env.CADUCIDAD_TOKEN })
                return res.json(responseOk([{ usuario: userDB }, token]))
            }
        } else { //el usr no existe
            let usuarioDB = new Usuario()
            usuarioDB.nombre = gUser.nombre
            usuarioDB.email = gUser.email
            usuarioDB.img = gUser.picture
            usuarioDB.password = ':)'
            usuarioDB.save((err, usrDB) => {
                if (err)
                    return res.status(500).json(responseError(err))
                let token = jwt.sign({
                    usuario: usrDB
                }, process.env.SEED_TOKEN
                    , { expiresIn: process.env.CADUCIDAD_TOKEN })
                return res.json(responseOk([{ usuario: usrDB }, token]))
            })
        }
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