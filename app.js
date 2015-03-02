"use strict";
var express = require('express'),
    app = express(),
    jade = require('jade'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    server = require('http').createServer(app),
    path = require('path'),
    io = require('socket.io').listen(server),
    port = 80;

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    provider:String,
    provider_id:{type: String, unique:true },
    photo:String,
    createdAt:{type: Date, defoult: Date.now}
});

var User = mongoose.model('User', UserSchema);

server.listen(port, function() {
    console.log('server corriendo en el puerto: ' + port);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res) {
    res.render("home");
});

io.on('connection', function(socket) {

    socket.on('mjs', function(data) {
        console.log(data);
        io.emit('mjsBroadcast', {
            mensaje: data
        });
    });

    socket.on('disconect', function(data) {
        console.log(data.toArray());
        io.emit('userDisconected', {
            user: data.id
        });
        console.log('usuario ' + data.id);
    });
});