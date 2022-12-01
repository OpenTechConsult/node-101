const bcrypt = require('bcrypt')

const User = require('../model/User')

const handleNewUser = async (req, res) => {
    const { user, password } = req.body
    if (!user || !password) {
        return res.status(400).json({ "message": " username and password are required" })
    }
    // check duplicate username
    const duplicate = await User.findOne({ username: user }).exec()
    if (duplicate) {
        return res.sendStatus(409) // conflict
    }

    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10)
        // create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        })

        console.log('result:', result)

        res.status(201).json({ "message": `New user ${user} created!` })
    } catch (err) {
        res.status(500).json({ "message": err.message })
    }
}

module.exports = {
    handleNewUser
}