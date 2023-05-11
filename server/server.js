var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
})
var PORT = process.env.PORT || 3002


var surveyList = [
    {
        id: 'deneme',
        chartType: 'bar',
        chartTitle: "Bar Chart",
        createdDate: 'Tue May 12 2023 20:00:01 GMT+0300 (GMT+03:00)',
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
        createdDate: 'Tue Jun 11 2023 12:00:01 GMT+0300 (GMT+03:00)',
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
        createdDate: 'Tue Jun 15 2023 12:00:01 GMT+0300 (GMT+03:00)',
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
var userVote = [
    {
        userId: '05541693820',
        surveyId: 'deneme',
        selectedOption: 'Option X',
    },
    {
        userId: '05541693823',
        surveyId: 'deneme3',
        selectedOption: 'Option A',
    }
]
app.get('/', function (req, res) {
    res.send()
})
//siteye giriş yapan kullanıcının bilgisini alır
//işlemler ve dinlemeler bunun içinde gerçekleşir
io.on('connection', function (socket) {
    //io.emit tüm tarayıcılara gider
    //socket.emit sadece benim tarayıcıma gelir
    //socket.broadcast benim dışımdaki diğer tarayıcılara gider
    io.emit('dataSendFront', { surveyList: surveyList, userVote: userVote, userPhone: '05372997045' })
    socket.on('newChartSendServer', function (e) {
        surveyList.push({
            ...e, id: `${Math.floor(
                Math.random() * Math.pow(10, 20),
            )}-${new Date().getTime()}`, createdDate: new Date()
        })
        io.emit('dataSendFront', { surveyList: surveyList, userVote: userVote , userPhone: '05372997045'})
    })
    socket.on('voteSendServer', function (e) {
        if (!!e.label && !!e.id) {
            var userVoteIndexNumber = surveyList.findIndex(x => x.id == e.id)
            var votingOptionIndexNumber = surveyList[userVoteIndexNumber].votingOptions.findIndex(x => x.labelTitle == e.label)
            surveyList[userVoteIndexNumber].votingOptions[votingOptionIndexNumber].voteCount++
            userVote.push({ selectedOption: e.label, surveyId: e.id, userId: e.userId })
            io.emit('dataSendFront', { surveyList: surveyList, userVote: userVote, userPhone: '05372997045' })
        }

    })
});
http.listen(PORT, function () {
    console.log(` server ${PORT} çalıştı`)
})
