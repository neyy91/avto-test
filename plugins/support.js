'use strict'

const fp = require('fastify-plugin')
const crypto = require('crypto')


module.exports = fp(function (fastify, opts, next) {
  fastify.decorate('CurrentTime', function () {
    let currentTime = Math.floor(new Date() / 1000)
    return currentTime
  })

  fastify.decorate('CryptPassword', function (password) {
    let cryptPassword = crypto.createHash('md5').update(password).digest('hex')
    return cryptPassword
  })

  fastify.decorate('GetAuthToken', function (request) {
    
    return new Promise((resolve, reject) => {
      let token = request.headers && request.headers['authorization']
      if (!token) reject(new Error('Authorization header not exists'))
      else resolve(token)
    })
  })

  next()
})
