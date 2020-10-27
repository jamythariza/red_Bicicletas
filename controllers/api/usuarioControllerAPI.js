var Usuario = require('../../models/usuario');

exports.usuario_list = function(req, res) {
    Usuario.find({}, function(err, usuario) {
        res.status(200).json({
            usuarios: usuario
        });
    });
};

exports.usuario_create = function(req, res) {
    var usuario = new Usuario({
        nombre: req.body.nombre
    });

    usuario.save(function(err) {
        res.status(200).json(usuario);
    });
};

exports.usuario_reservar = function(req, res) {
    Usuario.findById(req.body.id, function(err, usuario) {
        usuario.reservar(req.body.biciId, req.body.desde, req.body.hasta, function(err) {
            console.log('reserva!!');
            res.status(200).send();
        })
    })
};