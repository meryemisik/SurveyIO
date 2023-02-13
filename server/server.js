var app = require('express')()
var http = require('http').Server(app)
var	io = require('socket.io')(http);
var PORT = process.env.PORT || 3002

var userVote = {
    a:3,
    b:4,
    c:10,
    d:5 
}

app.get('/', function (req, res) {
    res.send()
})
//siteye giriş yapan kullanıcının bilgisini alır
//işlemler ve dinlemeler bunun içinde gerçekleşir
io.on('connection', function (socket) {
    console.log('yeni bir kullanıcı giriş yaptı.',socket.id)
    //io.emit tüm tarayıcılara gider
    //socket.emit sadece benim tarayıcıma gelir
    //socket.broadcast benim dışımdaki diğer tarayıcılara gider
    io.emit('dataSendFront', userVote)
    socket.on('voteSendServer',function(e) {
        console.log('e',e)
        userVote[e]++;
        io.emit('dataSendFront', userVote)
        console.log("userVote",userVote)
    })
});
http.listen(PORT,function(){
    console.log(` server ${PORT} çalıştı`)
})
