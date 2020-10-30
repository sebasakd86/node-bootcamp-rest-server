require('./config/config')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

//Middleware
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json
app.use(require('./routes/usuario'))

const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}

mongoose.connect('mongodb://localhost/cafe', connectionOptions, (err, res) => {
    if (err)
        throw err
    console.log(`\n ---> Se conecto con la BD`)
})

app.listen(process.env.PORT, () => {
    console.log('\n ---> Escuchando en el puerto', process.env.PORT)
})