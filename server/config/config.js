// ==========================
//     PUERTO
// ==========================
process.env.PORT = process.env.PORT || 5000

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

let urlDB = process.env.URLMONGO

if (process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost/cafe'

process.env.URL_DB = urlDB