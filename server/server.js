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

app.get('/', function (req, res) {
    res.send()
})
const getAllSurveys = async () => {
    const surveysCol = collection(db, "surveys");
    const querySnapshot = await getDocs(surveysCol);

    querySnapshot.forEach((doc) => { 
        if(surveyList.filter(e => e.id == doc.data().id).length == 0){
           surveyList.push(doc.data())
        }
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
        e)
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
       
        io.emit('dataSendFront', { surveyList: surveyList, userVote: userVote })
        if(e.userId != 'testUser'){
            setSurveyList({
                ...e, id: newChartId, createdDate: newChartDate
            })
        }
    })


    socket.on('voteSendServer', function (e) {
        if (!!e.label && !!e.id) {
            var userVoteIndexNumber = surveyList.findIndex(x => x.id == e.id)
            var votingOptionIndexNumber = surveyList[userVoteIndexNumber].votingOptions.findIndex(x => x.labelTitle == e.label)
            surveyList[userVoteIndexNumber].votingOptions[votingOptionIndexNumber].voteCount++ 
            userVote.push({ selectedOption: e.label, surveyId: e.id, userId: e.userId })
            io.emit('dataSendFront', { surveyList: surveyList, userVote: userVote })
            if(e.userId != 'testUser'){
                setSurveyList(surveyList[userVoteIndexNumber])
                addUserVote({ selectedOption: e.label, surveyId: e.id, userId: e.userId, createdDate: Date() })
            }
        }

    })


    socket.on('userlogin', function (e) {
        saveUser({...e, createdDate: Date()})
    })
});
http.listen(PORT, function () {
    console.log(` server ${PORT} çalıştı`)
})
