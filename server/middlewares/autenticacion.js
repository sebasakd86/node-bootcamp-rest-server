const jwt = require('jsonwebtoken')

let verificarToken = (req, res, next) => {
    let token = req.get('token')
    // console.log(token, process.env.SEED_TOKEN)
    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err)
            return res.status(401).json({
                ok: false,
                err
            })
        req.usuario = decoded.usuario
        next()
    })
}

let verificaAdminRole = (req, res,next) => {
    let u = req.usuario;
    if(u.role != 'ADMIN_ROLE')
        return res.json({
            ok: false,
            err: 'Usuario no es Administrador'
        })
    next()
}

module.exports = {
    verificarToken,
    verificaAdminRole
}