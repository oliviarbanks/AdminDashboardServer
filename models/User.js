const knex = require('../knexfile')
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    if (data) {
      this.id = data.id;
      this.username = data.username;
      this.password_hash = data.password_hash;
      this.email = data.email;
    }
  }

  static async getById(id) {
    try {
      const user = await knex('users').where({ id }).first();
      return user ? new User(user) : null;
    } catch (error) {
      throw error;
    }
  }

  static async getByUsername(username) {
    try {
      const user = await knex('users').where({ username }).first();
      return user ? new User(user) : null;
    } catch (error) {
      throw error;
    }
  }

  static async create(username, password, email) {
    try {
      const password_hash = await bcrypt.hash(password, 10); // Hash the password
      const [id] = await knex('users').insert({ username, password_hash, email });
      return id;
    } catch (error) {
      throw error;
    }
  }

  async verifyPassword(password) {
    try {
      return await bcrypt.compare(password, this.password_hash);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
