const express = require('express'); // express module 가져고이
const app = express(); // function 이용해 app 생성
const port = 3000; // port 설정

// mongoose 이용해서 연결
const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://Kang:kangbyho7510@youtubeclone.qujqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send("Hello World!")) //root 에서 hello world 출력 설정

app.listen(port, ()=> console.log(`Example app listening on port ${port}!`)) // port에서 실행   