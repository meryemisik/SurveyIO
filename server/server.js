var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
})
var PORT = process.env.PORT || 3002


var userVote = [
    {
        id:'deneme',
        chartType:'bar',
        chartTitle: "Bar Chart",
        votingOptions: [
            {
                labelTitle: 'Meyro',
                voteCount: 1,
                bgColor: "pink",
                borderColor:"pink"
            },
            {
                labelTitle: 'Meyruş',
                voteCount: 1,
                bgColor: "blue",
                borderColor:"blue"
            },
            {
                labelTitle: 'Mery',
                voteCount: 1,
                bgColor: "red",
                borderColor:"red"
            },
            {
                labelTitle: 'Merr me',
                voteCount: 1,
                bgColor: "yellow",
                borderColor:"yellow"
            },
        ]
    },
    {
        id:'deneme2',
        chartType:'line',
        chartTitle: "Line Chart",
        votingOptions: [
            {
                labelTitle: 'Meyro',
                voteCount: 1,
                bgColor: "pink",
                borderColor:"pink"
            },
            {
                labelTitle: 'Meyruş',
                voteCount: 1,
                bgColor: "blue",
                borderColor:"blue"
            },
            {
                labelTitle: 'Mery',
                voteCount: 1,
                bgColor: "red",
                borderColor:"red"
            },
            {
                labelTitle: 'Merr me',
                voteCount: 1,
                bgColor: "yellow",
                borderColor:"yellow"
            },
        ]
    },
    {
        id:'deneme3',
        chartType:'polarArea',
        chartTitle: "PolarArea Chart ",
        votingOptions: [
            {
                labelTitle: 'Meyroooo',
                voteCount: 1,
                bgColor: "blue",
                borderColor:"blue"
            },
            {
                labelTitle: 'Meyruşki',
                voteCount: 1,
                bgColor: "orange",
                borderColor:"orange"
            }
        ]
    },
]

app.get('/', function (req, res) {
    res.send()
})
//siteye giriş yapan kullanıcının bilgisini alır
//işlemler ve dinlemeler bunun içinde gerçekleşir
io.on('connection', function (socket) {
    console.log('yeni bir kullanıcı giriş yaptı.', socket.id)
    //io.emit tüm tarayıcılara gider
    //socket.emit sadece benim tarayıcıma gelir
    //socket.broadcast benim dışımdaki diğer tarayıcılara gider
    io.emit('dataSendFront', userVote)
    socket.on('newChartSendServer', function (e) {
         userVote.push(e)
         io.emit('dataSendFront', userVote)
    })
    socket.on('voteSendServer', function (e) {
        console.log('e', e)
        var userVoteIndexNumber =userVote.findIndex(x => x.id == e.id)
        var votingOptionIndexNumber = userVote[userVoteIndexNumber].votingOptions.findIndex(x => x.labelTitle == e.label)
        userVote[userVoteIndexNumber].votingOptions[votingOptionIndexNumber].voteCount++
         io.emit('dataSendFront', userVote)
    })
});
http.listen(PORT, function () {
    console.log(` server ${PORT} çalıştı`)
})
