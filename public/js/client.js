<script>
"use strict";
var socket = io.connect();
console.log(socket);

$('form').submit(function() {
    socket.emit('mjs', $('#m').val());
    $('#m').val('');
    return false;
});
socket.on('mjsBroadcast', function(req) {
    $('#messages').append($('<li>').text(req.mensaje));
});
socket.on('userDisconected', function(data) {
    console.log(data);
});

window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

navigator.getUserMedia({
    audio: true,
    video: true
}, function(vid) {
    document.querySelector('video').src = window.URL.createObjectURL(vid);
}, function(err) {
    console.log(err);
});
</script>