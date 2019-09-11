const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRouter = require('../router/auth-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
	res.send('Does coding make me nerdy?')
})

module.exports = server;