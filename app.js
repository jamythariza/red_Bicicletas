require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('./config/passport');
const session = require('express-session');
var token = require('./models/token')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bicicletasRouter = require('./routes/bicicletas');
var bicicletasAPIRouter = require('./routes/api/bicicletas');
var usuariosAPIRouter = require('./routes/api/usuario');
var authRouter=require("./routes/Api/auth");

const store = new session.MemoryStore;
const usuariosRouter = require('./routes/usuarios');
const tokenRouter = require('./routes/token');
const jwt = require('jsonwebtoken');

var app = express();
app.set('secretKey', 'jwt_pwd_!123');
app.use(session({
  cookie: {
    maxAge: 240 * 60 * 60 * 1000,   
  },
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'res_bicis_123'
}));

var mongoose = require('mongoose');
const usuario = require('./models/usuario');
//ambiente dev
//var mongoDB = 'mongodb://localhost:27017/red_bicicletas';
// ambiente production
//var mongoDB = 'mongodb+srv://admin:PhB6gpW9WSbGhRqy@red-bicicletas.gxdnp.mongodb.net/red-bicicletas?retryWrites=true&w=majority';
var mongoDB = process.env.NODE_URI;
mongoose.connect(mongoDB,{ useNewUrlParser:true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console,'MonogoDB connection error: ')) 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', function(req, res){
  res.render('session/login');
});


app.post('/login', function(req, res, next){

    passport.authenticate('local', function(err, usuario, info){
      console.log(usuario);
      console.log(err);
      if (err) {
        return next(err);
      }
      if (!usuario) {
        return res.render('session/login', {info});
      }
      req.logIn(usuario, function(){
        if (err) {
          return next(err);
        }
        return res.redirect('/');
      });
    })(req,res,next);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/')
});

app.get('/forgotPassword', function(req, res){
  res.render('session/forgotPassword');
});

app.post('/forgotPassword', function(req, res){
  usuario.findOne( { email: req.body.email }, function (err, usuario) {
    if (!usuario) return res.render('session/forgotPassword', {info: {message: 'No existe el email para un usuario existente.'}});

    usuario.resetPassword(function(err) {
      if (err) return next(err);
      console.log('forgotPasswordMessage');
    });
    
    res.render('session/forgotPasswordMessage');
  });
});

app.get('/resetPassword/:token', function(req, res, next) {
  console.log(req.params.token);
  token.findOne({ token: req.params.token }, function ( err, token ) {
    if (!token) return res.status(400).send( { type: 'not-verifified', msg: 'No existe un usuario asociado al token. Verifique que su token no haya expirado'});

    usuario.findById(token._userId, function (err, usuario) {
      if (!usuario) return res.status(400).send( { msg: 'No existe un usuario asociado al token'});
      res.render('session/resetPassword', { errors: {}, usuario: usuario});
    });
  });
});

app.post('/resetPassword', function(req, res) {
  if (req.body.password != req.body.confirm_password) {
    res.render('session/resetPassword', {errors: {confirm_password: {message: 'No coincide con el password ingresado'}},
        usuario: new Usuario({ email: req.body.email })});
    return;
  }
  usuario.findOne({ email: req.body.email }, function ( err, usuario ) {
      usuario.password = req.body.password; 
      usuario.save(function(err) {
        if (err) {
          res.render('session/resetPassword', {errors: err.errors, usuario: new Usuario({ email: req.body.email })});
        }
        else {
          res.redirect('/login');
        }});        
      });
});



app.use('/users', usersRouter);
app.use('/bicicletas', loggedIn, bicicletasRouter);//pasa primero por el middleware loggedIn
app.use('/api/bicicletas', validarUsuario,bicicletasAPIRouter); 
app.use('/api/usuarios', usuariosAPIRouter);
app.use("/api/auth",authRouter);
app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);
app.use('/', loggedIn, indexRouter);

app.use('/privacy_policy.html', function(req, res){
  res.sendFile('public/privacy_policy.html');
});

app.use('/googleb6a33ca5d0d76f4e.html', function(req, res){
  res.sendFile('public/googleb6a33ca5d0d76f4e.html');
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

function loggedIn(req, res, next) {
  if (req.user) { //guarda los datos del usuario en el request
    next();
  }
  else {
    console.log('Usuario sin loguearse');
    res.redirect('/login');
  }
}

function validarUsuario(req, res, next){
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded){
    if(err) {
      res.json({status:"error", message:err.message, data:null});
    }else{
      req.body.userId = decoded.id;
      console.log('jwt verify: ' + decoded);
      next();
    };
  });
}
module.exports = app;
