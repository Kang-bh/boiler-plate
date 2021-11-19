const express = require('express'); // express module 가져고이
const app = express(); // function 이용해 app 생성
const port = 3000; // port 설정
const bodyParser = require('body-parser');
const { User } = require("./models/user");

const config = require("./config/key")

//bodyParser 옵션 추가
// application/x-www-form-urlencoded 형식 데이터 분석해서 가져오도록
app.use(bodyParser.urlencoded({extended: true}));
// applicaiton/json 타입 분석해서 가져오도록
app.use(bodyParser.json());


// mongoose 이용해서 연결
const mongoose = require("mongoose");
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send("Hello World! 나가.")) //root 에서 hello world 출력 설정

// 회원가입 위한 route
app.post('/register', (req, res) => {
    console.log("req.body : ", req.body);
    // 회원 가입 시 필요한 정보들 client에서 가져와서 데이터 베이스에 저장
    const user = new User(req.body)
    // req.body에 { id: "hello", passseord :"123"} json형식 으로 존재.
    console.log("=====================");
    console.log("user: ", user);
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success : true
         })
    })
})

//Nodemon -> 서버 refresh 하면 바로 적용


app.listen(port, ()=> console.log(`Example app listening on port ${port}!`)) // port에서 실행   