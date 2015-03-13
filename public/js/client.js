<script>
"use strict";
var socket = io.connect();
$(document).ready(function(){
	console.log(socket);
});

$('#log-in').submit(function (e){
	e.preventDefault();
	socket.emit('nombreUsuario', {
		nombre: $('#nombre').val(),
		region: $('#region_text').val()
	});

	socket.on('user',function (data){
		console.log('nombre: '+ data);
	});
	socket.on('champions',function (data){
		console.log('champions: '+ data);
	});
});

$('#chat').submit(function (e) {
	e.preventDefault();
    socket.emit('mjs', $('#chat_text').val());
    $('#chat_text').val('');
});
socket.on('mjsBroadcast', function(req) {
    $('#messages').append($('<li>').text(req.mensaje));
});
socket.on('userDisconected', function(data) {
    console.log(data);
});

//future videoCalling
/*window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

navigator.getUserMedia({
    audio: true,
    video: true
}, function(vid) {
    document.querySelector('video').src = window.URL.createObjectURL(vid);
}, function(err) {
    console.log(err);
});*/
</script>