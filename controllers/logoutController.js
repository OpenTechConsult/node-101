const path = require('node:path')
const fsPromises = require('node:fs/promises')

const users = require('../model/users.json')


const usersDB = {
    users: users,
    setUsers: function (data) {
        this.users = data
    }
}

const handleLogout = async (req, res) => {
    // on the client also delete the accessToken
    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.sendStatus(204) // no content to send back
    }
    const refreshToken = cookies.jwt

    // Is refreshToken in DB ?
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)
    if (!foundUser) {
        res.clearCookie(
            'jwt',
            {
                httpOnly: true,
                sameSite: 'None',
                secure: true
            },
        )
        return res.sendStatus(204)
    }

    // delete refreshToken in DB
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken)
    const currentUser = { ...foundUser, refreshToken: '' }
    usersDB.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    )

    // secure: true - only serves on https
    res.clearCookie(
        'jwt',
        {
            httpOnly: true,
            sameSite: 'None',
            secure: true
        }
    )
    res.sendStatus(204)
}

module.exports = { handleLogout }

