'use strict'

const fp = require('fastify-plugin')
const _ = require('lodash')

const ERRORS = require('../constants/errors')


module.exports = fp(async function (fastify, opts) {

  fastify.decorate('UserLoginCheck', async function (dataLogin) {

    let inData = _.pick(dataLogin, ['login', 'password'])

    if (!inData || !inData.login || !inData.password) {
      throw await fastify.Errors(ERRORS.INVALID_INPUT_LOGIN_DATA)
    }

    let login = inData.login
    let pwd = fastify.CryptPassword(inData.password)

    const connection = await fastify.mysql.getConnection()

    let data = await connection.query(
      ' SELECT id,login,token FROM users ' +
      ' WHERE login=? AND password=? LIMIT 1',
      [login, pwd])

    connection.release()

    let user = data[0] && data[0][0]

    if (!user) {
      throw await fastify.Errors(ERRORS.INVALID_INPUT_LOGIN_DATA)
    }

    return user
  })

  fastify.decorate('FindUserByLogin', async function (login) {

    const connection = await fastify.mysql.getConnection()

    let data = await connection.query(
      ' SELECT id FROM users ' +
      ' WHERE login=? LIMIT 1',
      [login])

    connection.release()

    let user = data[0] && data[0][0]

    return user
  })


})
