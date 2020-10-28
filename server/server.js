require('./config/config')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

//Middleware
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json

app.get('/usuario', function (req, res) {
    res.json('get')
})
app.post('/usuario', function (req, res) {
    let body = req.body
    if(!body.nombre){
        res.status(400).json({
            ok: false,
            msg: 'Falta el nombre'
        });
    }
    else
        res.json({ body })
})
app.put('/usuario/:id', function (req, res) {
    let id = req.params.id
    res.json({ id })
})
app.delete('/usuario', function (req, res) {
    res.json('delete')
})

app.listen(3000, () => {
    console.log('Escuchando', process.env.PORT)
})