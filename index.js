const express = require('express'); // express module 가져고이
const app = express(); // function 이용해 app 생성
const port = 3000; // port 설정
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require("./models/user");
const { auth } = require('./middleware/auth');

const config = require("./config/key")

//bodyParser 옵션 추가
// application/x-www-form-urlencoded 형식 데이터 분석해서 가져오도록
app.use(bodyParser.urlencoded({extended: true}));
// applicaiton/json 타입 분석해서 가져오도록
app.use(bodyParser.json());
app.use(cookieParser());


// mongoose 이용해서 연결
const mongoose = require("mongoose");
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send("Hello World! 나가.")) //root 에서 hello world 출력 설정

// 회원가입 위한 route
app.post('/api/users/register', (req, res) => {
    console.log("req.body : ", req.body);
    // 회원 가입 시 필요한 정보들 client에서 가져와서 데이터 베이스에 저장
    const user = new User(req.body)
    // save 전 암호화 필요
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

app.post('/api/users/login', (req, res) => {
    // 이메일 존재하는 지 확인
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess : false,
                message: "해당하는 이메일을 가진 유저가 없습니다."
            })
        }
         // 비밀번호 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
                return res.json({ loginSuccess:false, message: "비밀번호가 틀렸습니다."})
            
            // 토큰 생성
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
                
                // 토큰 저장
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })
            })
        })
   
    })
})

app.get('/api/users/auth', auth ,(req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false: true,
        isAuth : true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

//Nodemon -> 서버 refresh 하면 바로 적용

app.get('/api/users/logout', auth, (req, res) => {

    User.findOneAndUpdate({ _id: req.user._id},
        { token: ""}
        , (err, user) => {
            if(err) return res.json({ success: false, err });
            return res.status(200).send({
                success:true
            })
        })
})

app.listen(port, ()=> console.log(`Example app listening on port ${port}!`)) // port에서 실행   