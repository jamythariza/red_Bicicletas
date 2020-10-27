var Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = function(req, rest){
    Bicicleta.allBicis(function(err,bicis){
        rest.status(200).json({
            bicicletas: bicis
        });
    });
}

exports.bicicleta_create = function(req, rest){
    var bici = new Bicicleta({code:req.body.id, color:req.body.color,modelo:req.body.modelo});
    bici.ubicacion = [req.body.lat, req.body.lng];
    Bicicleta.add(bici,function(err){
        rest.status(200).json({
            bicicleta:bici
        });      
    });
}

exports.bicicleta_delete = function(req, rest){
    Bicicleta.removeByCode(req.body.id, function(err){
        rest.status(204).send();
    });
}