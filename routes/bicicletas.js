var express = require('express');
var router = express.Router();
var biicletaController = require('../controllers/bicicleta');

router.get('/', biicletaController.bicicleta_list);
router.get('/create', biicletaController.bicicleta_create_get);
router.post('/create', biicletaController.bicicleta_create_post);
router.post('/:id/delete', biicletaController.bicicleta_delete_post);
router.get('/:id/update', biicletaController.bicicleta_update_get);
router.post('/:id/update', biicletaController.bicicleta_update_post);

module.exports = router;


