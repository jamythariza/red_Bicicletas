var Bicicleta = require('../models/bicicleta');

exports.bicicleta_list = function(req, res){
    Bicicleta.allBicis(function(err,bicis){
        res.render('bicicletas/index', {bicis:bicis});
    });
}

exports.bicicleta_create_get = function(req,res){
    res.render('bicicletas/create');
}

exports.bicicleta_create_post = function(req,res){
    var bici = new Bicicleta({code:req.body.id, color:req.body.color,modelo:req.body.modelo});
    bici.ubicacion = [req.body.lat,req.body.lng];
    Bicicleta.add(bici);
    res.redirect('/bicicletas');
}

exports.bicicleta_delete_post = function(req,res){
    Bicicleta.removeByCode(req.body.id,function(err){
        res.redirect('/bicicletas');
    });
}

exports.bicicleta_update_get = function(req,res){
    Bicicleta.findByCode(req.params.id, function(error, bici){
        res.render('bicicletas/update', {bici});   
    });
}

exports.bicicleta_update_post = function(req,res){
    Bicicleta.findByCode(req.params.id, function(error, bici){
        res.redirect('/bicicletas');   
    });
}
