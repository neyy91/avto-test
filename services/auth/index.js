'use strict'

const {
  registration: registrationSchema,
  login: loginSchema,
  logout: logoutSchema
} = require('./shemas')

module.exports = function (fastify, opts, next) {
  
  
  fastify.post('/auth/registration', {
    schema: registrationSchema
  }, registrationUserHandler)

  fastify.post('/auth/login', {
    schema: loginSchema
  }, loginUserHandler)

  fastify.post('/auth/logout', {
    preHandler: [fastify.authPreHandler],
    schema: logoutSchema
  }, logoutUserHandler)

  next()
}

module.exports[Symbol.for('plugin-meta')] = {
  decorators: {
    fastify: [
      'authService'
    ]
  }
}

async function registrationUserHandler (req, reply) {
  return this.authService.registrationUser(req.body)
    .then(res => {
      reply.send({
        code: 201,
        error: false,
        data: res
      })
    })
    
}

async function loginUserHandler (req, reply) {
  return this.authService.loginUser(req.body,req.auth)
    .then(res => {
      reply.send({
        code: 201,
        error: false,
        data: res
      })
    })
   
}

async function logoutUserHandler (req, reply) {
  return this.authService.logoutUser(req.token,req.auth)
    .then(res => {
      reply.send({
        code: 201,
        error: false,
        data: res
      })
    })
  
}
