const { User } = require("../models/user");

let auth = (req, res, next) => {
    // 클라 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;
    // 토큰을 복호화 한 후 유저 find
    User.findByToken(token, (err,user) => {
        if (err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next();
    })
    // 있으면 인정 pass
}

module.exports = { auth }