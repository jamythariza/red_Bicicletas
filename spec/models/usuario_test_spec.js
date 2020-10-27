var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');

describe('Testing de Usuario', function(){

    beforeAll(function(done){      
        var mongoDB = 'mongodb://localhost:27017/testdb';
        mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true });
        const db = mongoose.connection;
        db.on('open', _ => {
            console.log('we are connected to test database!');
            done();
        });
        db.on('error', console.error.bind(console,'connection error'));
    });

    afterAll(function(done) {
        mongoose.disconnect();
        done();        
    });

    afterEach((done) => {
        Reserva.deleteMany({}, function(err, success) {
            if (err) {console.log(err);}
            Usuario.deleteMany({}, function(err, success) {
                if (err) {console.log(err);}
                Bicicleta.deleteMany({}, function(err, success) {
                    if (err) {console.log(err);}
                    done();
                });
            })
        });
    });
    
    
    describe('Cuando se reserva una bici', () => {
        it('debe existir la reserva', (done) => {
            const usuario = new Usuario({ nombre: 'Luis' });
            usuario.save();

            var bicicleta = new Bicicleta({ code: 1, color: 'verde', modelo: 'urbana' });
            bicicleta.save();

            var today = new Date();
            var tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            usuario.reservar(bicicleta.id, today, tomorrow, function(err, reserva) {
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas) {
                    //console.log(reservas[0]);
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);

                    done();
                });
            });
        });
    });


});