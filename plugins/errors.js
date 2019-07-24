'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  fastify.decorate('Errors', function (errorData) {
    let error = new Error(errorData.message)
    error.status = errorData.code
    return error
  })

  fastify.decorate('ErrorsDefault', function (errorData) {
    let error = new Error(errorData)
    error.status = 400
    return error
  })
})
