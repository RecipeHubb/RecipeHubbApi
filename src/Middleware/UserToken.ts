export{}
const jwt = require('../util/jwt.ts')
const { UserModel } = require('../models/userSchema');
const UserMid = async (req, res, next) => {
    const claims = jwt.valid(req.headers.token)
    if (!claims) {
        return res.status(401).json({ success: false, message: 'Invalid or missing token' })
    }

    try {
        req.user = await UserModel.findOne({ "email": claims.email })
    } catch (err) {
        return next(err)
    }

    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Invalid or missing token' })
    }

    return next()
}

export = UserMid