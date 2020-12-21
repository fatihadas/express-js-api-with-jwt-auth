const config = require('config.json');
const jwt = require('jsonwebtoken');

// users hardcoded for simplicity, store in a db for production applications
const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User', isactive: true },
               { id: 2, username: 'aa', password: '11', firstName: 'Test2', lastName: 'User2', isactive: false }];

module.exports = { authenticate, getAll };

async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password && u.isactive === true);

    if (!user) throw 'Username or password is incorrect';

    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });

    return {
        ...omitPassword(user),
        token
    };
}

async function getAll() {
    return users.map(u => omitPassword(u));
}

// helper functions
function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}