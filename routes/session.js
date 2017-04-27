'use strict'

const bcrypt = require('bcrypt-as-promised')
const express = require('express')
const knex = require('../db/connection')
const router = express.Router()

router.get('/', (req, res, next) => {
  console.log('req.query in the post is ', req.query)
  let email = req.query.user_email
  let password = req.query.user_password

  if (!email || !email.trim()) {
    return next({
      status: 400,
      message: 'Please enter a valid email address.'
    })
  }

  if (!password) {
    return next({
      status: 400,
      message: 'Please enter a valid password.'
    })
  }

  let user;
  knex('users')
    .where('user_email', email)
    .first()
    .then((row) => {
      if (!row) {
        // throw {
        //   status: 400,
        //   message: 'Bad email or password'
        // }
        console.log('got here');
        res.redirect('/login')
      }
      user = row
      return bcrypt.compare(password, user.hashed_password)
    })
    .then(() => {
      delete user.hashed_password
      req.session.userId = user.id
      console.log('in the session post route ');
      res.redirect('trucks')
    })
    .catch(bcrypt.MISMATCH_ERROR, () => {
      throw {
        status: 400,
        message: 'Bad email or password'
      }
    })
    .catch((err) => {
      next(err)
    })
})

router.get('/logout', (req, res, next) => {
  req.session = null
  res.redirect('/')
})

module.exports = router
