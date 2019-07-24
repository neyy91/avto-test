'use strict'

const fp = require('fastify-plugin')


module.exports = fp(async function (fastify, opts) {
  // ============= custom funtions ======================

  fastify.decorate('AddTockenToRedis', async function (tocketData) {
    try {
      await fastify.redis.set(tocketData.token, tocketData.userDara)
      return true
    } catch (e) {
      console.log(e)
    }
  })

  // ============= default funtions ======================

  fastify.decorate('DeleteKeyFromRedis', async function (key) {
    try {
      await fastify.redis.del(key)
      return true
    } catch (e) {
      console.log(e)
    }
  })
})
