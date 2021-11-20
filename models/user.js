const mongoose = require("mongoose");
const bycrpt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken')
// salt 이용해서 비밀번호 암호화
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength:5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token:{
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function( next ) {
    //save 전에 function 실행.
    let user = this;
    // 비밀번호 암호화 비밀번호 바꿀때만!!!!
    if(user.isModified('password')){
        bycrpt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
    
            bycrpt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash // hash된 비밀번호로 변경
                next()
            })
        })
    } else {
        next()
    }
    
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    bycrpt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
            cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    const user = this;
    //jsonwebtoken 이용해서 token 생성
    let token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user)
    })

}

userSchema.statics.findByToken = function ( token, cb ) {
    let user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저 find
        // 클라이언트에서 가져온 token 과 DB의 token 비교
        user.findOne({ "_id" : decoded, "token": token }, function(err, user){

            if(err) return cb(err);
            cb(null, user)

        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }