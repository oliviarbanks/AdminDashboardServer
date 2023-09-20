const knex = require('knex')(require('../knexfile'));
const express = require('express')
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

const jsonSecretKey = "f91e4494-04b3-4d49-8c27-57faed9e5785";

const signToken = (email) => {
  return jwt.sign({ email }, jsonSecretKey)
}

exports.getAllUsers = (_req, res) => {
  knex('users')
    .then((data) => {
      res.status(200).json(data);
    }
    )
}

exports.getOneUser = (req, res) => {
  knex('users')
    .where({ id: req.params.id })
    .then((data) => {
      if (!data.length) {
        return res.status(404).send('User not found')
      }
      res.status(200).json(data[0]);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving user ${req.params.id} ${err}`)
    );
}

exports.signup = (req, res) => {
  const user = {
    id: uuidv4(),
    email: req.body.email,
    password: req.body.password,
    company: req.body.company
  }
  knex('users')
    .insert(user)
    .then((data) => {
      console.log(user)
      const newUserURL = `/users/${data[0]}`
      res
        .status(201)
        .location(newUserURL)
        .json({ user: user, token: signToken(user.email) })
    })
    .catch((err) => res.status(400).send(`Error creating User: ${err}`));
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await knex('users').first('*').where({ email })
    if (!user) {
      console.log("no such user found:", req.body.email)
      res.status(401).send("User not found")
    }
    if (user.password === password) {
      let token = jwt.sign({ email: email }, jsonSecretKey)
      res
        .status(202, user, token)
        .json({ user, token: token })
    } else {
      console.log("Incorrect password for user:", email)
      res.status(403).send("Wrong email or password")
    }
  }
  catch (err) {
    next(err)
  }
}
