const path = require('node:path')
const fsPromises = require('node:fs/promises')

const bcrypt = require('bcrypt')

const users = require('../model/users.json')
const { use } = require('../routes/root')

const usersDB = {
    users: users,
    setUsers: function (data) {
        this.users = data
    }
}

const handleNewUser = async (req, res) => {
    const { user, password } = req.body
    if (!user || !password) {
        return res.status(400).json({ "message": " username and password are required" })
    }
    // check duplicate username
    const duplicate = usersDB.users.find(person => person.username === user)
    if (duplicate) {
        return res.sendStatus(409) // conflict
    }

    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10)
        // store the new user
        const newUser = { "username": user, "password": hashedPwd }
        usersDB.setUsers([...usersDB.users, newUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        )
        console.log(usersDB.users)
        res.status(201).json({ "message": `New user ${user} created!` })
    } catch (err) {
        res.status(500).json({ "message": err.message })
    }
}

module.exports = {
    handleNewUser
}