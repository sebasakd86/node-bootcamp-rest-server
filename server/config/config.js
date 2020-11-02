// ==========================
//     PUERTO
// ==========================
process.env.PORT = process.env.PORT || 5000

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

let urlDB = process.env.URLMONGO

if (process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost/cafe'

process.env.URL_DB = urlDB

// Vencimiento del token
process.env.CADUCIDAD_TOKEN = process.env.SEED_TOKEN || 60*60*24*30*365
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'abcdefghijklmnopqrstuvwxyz'
//Google
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '477252317453-i56mj690ccn71fpjdf1o68f5esv2innh.apps.googleusercontent.com'