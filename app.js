"use strict";
var express = require('express'),
    app = express(),
    jade = require('jade'),
    request = require('request'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    server = require('http').createServer(app),
    path = require('path');

var io = require('socket.io').listen(server),
    port = 80;

var fs = require('fs');

var request = require('request');

var session = require('express-session'),
    RedisStore = require('connect-redis')(session);

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//modelo usuario de mongodb
var UserSchema = new Schema({
    name: String,
    provider: String,
    provider_id: {
        type: String,
        unique: true
    }
});

var User = mongoose.model('User', UserSchema);

//seteamos el modelo de template
app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

//middlewares de session y parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
//app.use(session({secret: "hola", cookie: 60000}));

app.get("/", function(req, res) {
    res.render("home");
});

app.get('/:user', function(req, res) {

});

io.on('connection', function(socket) {

    socket.on('mjs', function(data) {
        console.log(data);
        io.emit('mjsBroadcast', {
            mensaje: data
        });
    });

    socket.on('nombreUsuario', function(data) {
        var key;
        fs.readFile('../lolApiKey/apikey.txt', function(err, res) {
            if (err) {
                console.log(err);
                return;
            } else {
                key = res;
                console.log(key.toString());
                //hacemos el request y leemos la key en otro archivo
                request('https://' + data.region + '.api.pvp.net/api/lol/las/v1.4/summoner/by-name/' + data.nombre + '?api_key=' + key.toString(), function(err, res, body) {
                    if (!err && res.statusCode === 200) {
                        socket.emit('user', body);
                    } else {
                        return err;
                    }
                });
            }
        });
    });

    socket.on('disconect', function(data) {

        console.log(data.toString());

        io.emit('userDisconected', {
            user: data.id
        });

        console.log('usuario ' + data.id);
    });
});

server.listen(port, function() {
    console.log('server corriendo en el puerto: ' + port);
});