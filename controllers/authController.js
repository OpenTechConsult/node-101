const bcrypt = require('bcrypt')

const users = require('../model/users.json')

const usersDB = {
    users: users,
    setUsers: function (data) {
        this.users = data
    }
}

const handleLogin = async (req, res) => {
    const { user, password } = req.body
    if (!user || !password) {
        return res.status(400).json({ "message": " username and password are required" })
    }

    const foundUser = usersDB.users.find(person => person.username === user)

    if (!foundUser) {
        return res.sendStatus(401) // Unauthorized
    }

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password)
    if (match) {
        // in the future create a JWT to send to use with the other routes
        // we want protected in our API
        res.json({ "success": `User ${user} is logged in` })
    } else {
        res.sendStatus(401)
    }
}

module.exports = { handleLogin }