var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
})
var PORT = process.env.PORT || 3002

const { db, getFirestore, collection,
    getDocs, doc, setDoc, query, orderBy, where } = require("./firebase-config");

    var surveyList = []

    var userVote = []

// var surveyList = [
//     {
//         id: 'deneme',
//         chartType: 'bar',
//         chartTitle: "Bar Chart",
//         createdDate: 'Tue May 12 2023 20:00:01 GMT+0300 (GMT+03:00)',
//         votingOptions: [
//             {
//                 labelTitle: 'Option X',
//                 voteCount: 1,
//                 bgColor: "gray",
//                 borderColor: "black"
//             },
//             {
//                 labelTitle: 'Option Y',
//                 voteCount: 1,
//                 bgColor: "lightblue",
//                 borderColor: "blue"
//             },
//             {
//                 labelTitle: 'Option Z',
//                 voteCount: 1,
//                 bgColor: "pink",
//                 borderColor: "red"
//             },

//         ]
//     },
//     {
//         id: 'deneme2',
//         chartType: 'line',
//         chartTitle: "Line Chart",
//         createdDate: 'Tue Jun 11 2023 12:00:01 GMT+0300 (GMT+03:00)',
//         votingOptions: [
//             {
//                 labelTitle: 'Option 111',
//                 voteCount: 1,
//                 bgColor: "pink",
//                 borderColor: "purple"
//             },
//             {
//                 labelTitle: 'Option 222',
//                 voteCount: 1,
//                 bgColor: "blue",
//                 borderColor: "white"
//             },
//             {
//                 labelTitle: 'Option 333',
//                 voteCount: 1,
//                 bgColor: "red",
//                 borderColor: "white"
//             },
//             {
//                 labelTitle: 'Option 444',
//                 voteCount: 1,
//                 bgColor: "yellow",
//                 borderColor: "orange"
//             },
//         ]
//     },
//     {
//         id: 'deneme3',
//         chartType: 'pie',
//         chartTitle: "Pie Chart ",
//         createdDate: 'Tue Jun 15 2023 12:00:01 GMT+0300 (GMT+03:00)',
//         votingOptions: [
//             {
//                 labelTitle: 'Option A',
//                 voteCount: 1,
//                 bgColor: "lightblue",
//                 borderColor: "blue"
//             },
//             {
//                 labelTitle: 'Option B',
//                 voteCount: 2,
//                 bgColor: "orange",
//                 borderColor: "red"
//             }
//         ]
//     },
// ]
// var userVote = [
//     {
//         userId: '05541693821',
//         surveyId: 'deneme',
//         selectedOption: 'Option X',
//     },
//     {
//         userId: '05541693823',
//         surveyId: 'deneme3',
//         selectedOption: 'Option A',
//     }
// ]

app.get('/', function (req, res) {
    res.send()
})
const getAllSurveys = async () => {
    const surveysCol = collection(db, "surveys");
    const querySnapshot = await getDocs(surveysCol);

    querySnapshot.forEach((doc) => {
        //console.log(`${doc.id} => ${doc.data()['name'].a}`);
        surveyList.push(doc.data())
    });
}

const getUserVotes = async () => {
    const uservoteCol = collection(db, "uservote");
    //const sorting = query(surveysCol, where("userId", "==", "053*******"));
    const querySnapshot = await getDocs(uservoteCol);

    querySnapshot.forEach((doc) => {
        userVote.push(doc.data())
        //console.log(`${doc.id} => ${doc.data()['name'].a}`);
    });
}

const saveUser = async (e) => {
    setDoc(
        doc(
            db,
            "users",
            e.uid
        ),
        {
            uid: e.uid,
            phoneNumber: e.phoneNumber,
        })
}



const setSurveyList = async (e) => {
    setDoc(
        doc(
            db,
            "surveys",
            e.id
        ),
        e)
}


const addUserVote = async (e) => {
    setDoc(
        doc(
            db,
            "uservote",
            `${e.userId}-${e.surveyId}`
        ),
        e)
}

//siteye giriş yapan kullanıcının bilgisini alır
//işlemler ve dinlemeler bunun içinde gerçekleşir
io.on('connection', function (socket) {

    const dataSending = () => {
        io.emit('dataSendFront', { surveyList: surveyList, userVote: userVote })
    }
   
    if (surveyList.length == 0) {
        getAllSurveys().then(() => {
            dataSending()
        })
    }
    if (userVote.length == 0) {
        getUserVotes().then(() => {
            dataSending()
        })
    }

    dataSending()

    //io.emit tüm tarayıcılara gider
    //socket.emit sadece benim tarayıcıma gelir
    //socket.broadcast benim dışımdaki diğer tarayıcılara gider


    socket.on('newChartSendServer', function (e) {
        var newChartId = `${Math.floor(
            Math.random() * Math.pow(10, 20),
        )}-${new Date().getTime()}`;
        var newChartDate = Date()
        surveyList.push({
            ...e, id: newChartId, createdDate: newChartDate
        })
        setSurveyList({
            ...e, id: newChartId, createdDate: newChartDate
        })
        io.emit('dataSendFront', { surveyList: surveyList, userVote: userVote })
    })


    socket.on('voteSendServer', function (e) {
        if (!!e.label && !!e.id) {
            var userVoteIndexNumber = surveyList.findIndex(x => x.id == e.id)
            var votingOptionIndexNumber = surveyList[userVoteIndexNumber].votingOptions.findIndex(x => x.labelTitle == e.label)
            surveyList[userVoteIndexNumber].votingOptions[votingOptionIndexNumber].voteCount++
            setSurveyList(surveyList[userVoteIndexNumber])
            userVote.push({ selectedOption: e.label, surveyId: e.id, userId: e.userId })
            addUserVote({ selectedOption: e.label, surveyId: e.id, userId: e.userId, createdDate: Date() })
            io.emit('dataSendFront', { surveyList: surveyList, userVote: userVote })
        }

    })


    socket.on('userlogin', function (e) {
        saveUser({...e, createdDate: Date()})
    })
});
http.listen(PORT, function () {
    console.log(` server ${PORT} çalıştı`)
})
