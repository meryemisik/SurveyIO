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
        id: 'deneme',
        chartType: 'bar',
        chartTitle: "Bar Chart",
        votingOptions: [
            {
                labelTitle: 'Option X',
                voteCount: 1,
                bgColor: "gray",
                borderColor: "black"
            },
            {
                labelTitle: 'Option Y',
                voteCount: 1,
                bgColor: "lightblue",
                borderColor: "blue"
            },
            {
                labelTitle: 'Option Z',
                voteCount: 1,
                bgColor: "pink",
                borderColor: "red"
            },

        ]
    },
    {
        id: 'deneme2',
        chartType: 'line',
        chartTitle: "Line Chart",
        votingOptions: [
            {
                labelTitle: 'Option 111',
                voteCount: 1,
                bgColor: "pink",
                borderColor: "purple"
            },
            {
                labelTitle: 'Option 222',
                voteCount: 1,
                bgColor: "blue",
                borderColor: "white"
            },
            {
                labelTitle: 'Option 333',
                voteCount: 1,
                bgColor: "red",
                borderColor: "white"
            },
            {
                labelTitle: 'Option 444',
                voteCount: 1,
                bgColor: "yellow",
                borderColor: "orange"
            },
        ]
    },
    {
        id: 'deneme3',
        chartType: 'pie',
        chartTitle: "Pie Chart ",
        votingOptions: [
            {
                labelTitle: 'Option A',
                voteCount: 1,
                bgColor: "lightblue",
                borderColor: "blue"
            },
            {
                labelTitle: 'Option B',
                voteCount: 1,
                bgColor: "orange",
                borderColor: "red"
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
        console.log("new chart datası : ", e)

        userVote.push({
            ...e, id: `${Math.floor(
                Math.random() * Math.pow(10, 20),
            )}-${new Date().getTime()}`
        })
        io.emit('dataSendFront', userVote)
        console.log("userVote : ", userVote)
    })
    socket.on('voteSendServer', function (e) {
        console.log('e', e)
        if (!!e.label && !!e.id) {
            var userVoteIndexNumber = userVote.findIndex(x => x.id == e.id)
            var votingOptionIndexNumber = userVote[userVoteIndexNumber].votingOptions.findIndex(x => x.labelTitle == e.label)
            userVote[userVoteIndexNumber].votingOptions[votingOptionIndexNumber].voteCount++
            io.emit('dataSendFront', userVote)
        }
       
    })
});
http.listen(PORT, function () {
    console.log(` server ${PORT} çalıştı`)
})
