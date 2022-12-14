const User = require('../model/User')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const handleLogin = async (req, res) => {
    const { user, password } = req.body
    if (!user || !password) {
        return res.status(400).json({ "message": " username and password are required" })
    }

    const foundUser = await User.findOne({ username: user }).exec()

    if (!foundUser) {
        return res.sendStatus(401) // Unauthorized
    }

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password)
    if (match) {
        //grab the role that we put in our users.json file
        const roles = Object.values(foundUser.roles)
        console.log(roles)
        // in the future create a JWT to send to use with the other routes
        // we want protected in our API
        // create accessToken
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60s' }
        )
        // create refresh token
        const refreshToken = jwt.sign(
            {
                "username": foundUser.username
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        // saving refreshToken with current user
        foundUser.refreshToken = refreshToken
        const result = await foundUser.save()
        console.log(result)

        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.json({ accessToken })
    } else {
        res.sendStatus(401)
    }
}

module.exports = { handleLogin }