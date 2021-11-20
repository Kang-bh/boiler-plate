const mongoose = require("mongoose");
const bycrpt = require("bcrypt");
const saltRounds = 10;
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

const User = mongoose.model('User', userSchema)

module.exports = { User }