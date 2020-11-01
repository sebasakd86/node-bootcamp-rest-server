require('./config/config')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const app = express()

//Middleware
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json

//habilitar public
let public = path.resolve(__dirname,'../public')
// let public = `${__dirname}/public`//path.resolve(__dirname,'../public')
app.use(express.static(public))

app.use(require('./routes/index'))

const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}

mongoose.connect(process.env.URL_DB, connectionOptions, (err, res) => {
    if (err)
        throw err
    console.log(`\n ---> Se conecto con la BD`)
})

app.listen(process.env.PORT, () => {
    console.log('\n ---> Escuchando en el puerto', process.env.PORT)
})