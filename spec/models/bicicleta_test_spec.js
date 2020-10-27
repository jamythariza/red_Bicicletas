var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');

describe('Testing Bicicletas', function() {
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

    afterEach(function(done){
        Bicicleta.deleteMany({}, function(err, success){
            if(err) console.log(err);
            done();
        });       
    });

    afterAll(function(done) {
        mongoose.disconnect();
        done();        
    });

    describe('Bicicleta.createInstance', () => {
        it('crea una instancia de Bicicleta', () =>{
            var bici = Bicicleta.createInstance(1,"verde", "urbano", [-34.5,-54.1]);
            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbano");
            expect(bici.ubicacion[0]).toBe(-34.5);
            expect(bici.ubicacion[1]).toBe(-54.1);
        });
    });

    describe('Bicicleta.allBicis', () => {
        it('comienza vacia', (done) =>{
            Bicicleta.allBicis(function(err,bicis){
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });

    describe('Bicicleta.add', () => {
        it('agrega solo una bici', (done) =>{
            var aBici = new Bicicleta({code:1, color:"verde",modelo:"urbana"});
            Bicicleta.add(aBici,function(err,newBici){
                if(err) console.log(err);
                Bicicleta.allBicis(function(err,bicis){
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);
                    done();
                });
            });
        });
    });

    describe('Bicicleta.findByCode', () => {
        it('debe devolver la bici con code 1', (done) => {
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0);

                var aBici = new Bicicleta({code:1, color:"verde", modelo:"urbana"});
                Bicicleta.add(aBici, function(err, newBici){
                    if(err) console.log(err);

                    var aBici2 = new Bicicleta({code:2, color:"azul", modelo:"urbana"});
                    Bicicleta.add(aBici2, function(err, newBici){
                        if (err) console.log(err);
                        Bicicleta.findByCode(1, function(error, targetBici){
                            expect(targetBici.code).toBe(aBici.code);
                            expect(targetBici.color).toBe(aBici.color);
                            expect(targetBici.modelo).toBe(aBici.modelo);

                            done();
                        });
                    });
                });
            });
        });
    });
});

/*
beforeEach(()=>{Bicicleta.allBicis = [];});

describe('Bicicleta.allBicis', () => {
    it('comienza vacia', () =>{
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

describe('Bicicleta.add', () => {
    it('agregamos una', () =>{
        expect(Bicicleta.allBicis.length).toBe(0);

        var a = new Bicicleta(1, 'rojo', 'urbana', [-34.6012424, -58.3861497]); 
        Bicicleta.add(a);

        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

describe('Bicicleta.findById', () => {
    it('debe devolver la bici con id 1', () =>{
        expect(Bicicleta.allBicis.length).toBe(0);

        var a = new Bicicleta(1, 'azul', 'urbana', [-34.6012424, -58.3861497]); 
        var b = new Bicicleta(2, 'verde', 'urbana', [-34.6012424, -58.3861497]); 

        Bicicleta.add(a);
        Bicicleta.add(b);

        var targetBici = Bicicleta.findById(1);

        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(a.color);
        expect(targetBici.modelo).toBe(a.modelo);
    });
});*/