const db = require('../database/dbConfig.js')

module.exports = {
	add,
	find,
	findBy,
	findById
};

function add(user) {
	db('users').insert(user).then(ids => {
		return findById(ids[0])
	})
};

function find() {
	return db('users').select('username', 'role', 'id')
};

function findBy(something) {
	return db('users').where(something);
};

function findById(id) {
	return db('users').where({id}).first();
};