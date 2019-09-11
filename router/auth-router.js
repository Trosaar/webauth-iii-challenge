const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthDB = require('./auth-model.js');

// | POST   | /api/register | Creates a `user` using the information sent inside the `body` of the request. **Hash the password** before saving the user to the database.
// | POST   | /api/login    | Use the credentials sent inside the `body` to authenticate the user. On successful login, create a new JWT with the user id as the subject and send it back to the client. If login fails, respond with the correct status code and the message: 'You shall not pass!' |
// | GET    | /api/users    | If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in respond with the correct status code and the message: 'You shall not pass!'. 

router.post('/register', async (req, res) => {
	const user = req.body;
	user.password = bcrypt.hashSync(user.password, 15);

	try {
		const newUser = await AuthDB.add(user)
		const token = await generateToken(newUser)
		res.status(201).json({
			user: newUser,
			token
		})
	} catch(err) {
		res.status(500).json({ message: "failed to create user" })
	}
})

router.post('/login', async (req, res) => {
	const { username, password } = req.body;

	try {
		const userInfo = await AuthDB.findBy({ username }).first();

		if(userInfo && bcrypt.compareSync(password, userInfo.password)) {
			const token = await generateToken(userInfo);
			res.status(200).json({ 
				message: `Hello ${userInfo.username}`,
				token
			})
		}
	} catch(err) {
		res.status(500).json({ message: "invalid credentials" })
	}
})

router.get('/users', async (req, res) => {
	try {
		const users = await AuthDB.find();
		res.status(200).json(users)
	} catch(err) {
		res.status(500).json({ message: "there has been an error, oh no!" })
	}
})

function generateToken(user) {
	const payload = {
		sub: user.id,
		username: user.username
	}

	const options = { 
		expiresIn: "8h"
	}

	return jwt.sign(payload, process.env.JWT_SECRET, options)
}

module.exports = router;