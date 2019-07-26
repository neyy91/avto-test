'use strict'
const path = require('path')
const AutoLoad = require('fastify-autoload')
const fp = require('fastify-plugin')

const fileUpload = require('fastify-file-upload')


const AuthService = require('./services/auth/service')
const UploadGeoDataService = require('./services/upload/service')

const swaggerOption = {
  swagger: {
    info: {
      title: 'Geo Service',
      description: 'Description methods API services',
      version: '0.1.0'
    },
    host: '127.0.0.1:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
  exposeRoute: true,
  routePrefix: '/swagger-docs'
}

async function connectToDatabases (fastify) {
  fastify
    .register(require('fastify-mysql'), {
      connectionLimit: 10,
      promise: true,
      host:'127.0.0.1',
      user: 'root',
      password: '0000',
      database:  'avto',
      charset: 'utf8mb4'
    })

    .register(require('fastify-redis'), {
      host: process.env.REDIS_IP || '127.0.0.1',
      port: 6379
    })
    fastify.register(require('fastify-jwt'), {
      secret: 'supersecret'
    })

}

module.exports = function (fastify, opts, next) {
  fastify.register(require('fastify-swagger'), swaggerOption)

  fastify.register(fileUpload)


  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({}, opts)
  })
  //= ===========init services================

  const authService = new AuthService(fastify)
  fastify.decorate('authService', authService)

  const uploadGeoDataService = new UploadGeoDataService(fastify)
  fastify.decorate('uploadGeoDataService', uploadGeoDataService)

  //= =============init base and auth ===========================

  fastify.register(fp(connectToDatabases))

  // ============== auth pre handlers ===========================
  fastify.decorate('authPreHandler', async function auth (request, reply) {
    try {
      let authData = await _authHandlerCheck(request, reply, fastify)
      request.auth = authData.id
      request.token = authData.token
    } catch (err) {
      reply.send(err)
    }
   
  })

  next()
}

async function _authHandlerCheck (request, reply, fastify) {

  let token = await fastify.GetAuthToken(request)

  let user = await getUserFromRedis(token, fastify.redis)
 
  if (!user) {
    user = await getUserFromMysql(token, fastify.reply, fastify.mysql)
  }

  return {
    id: user.id,
    token: token
  }
}

async function getUserFromRedis (token, redis) {
  let user = await redis.get(token)
  if (!user) {
    return false
  } else {
    return JSON.parse(user)
  }
}

async function _query (token, mysql) {
  const connection = await mysql.getConnection()

  let user = await connection.query('SELECT * FROM users WHERE token=? LIMIT 1',[token]  ) 
  connection.release()
  return user && user[0]
}

async function getUserFromMysql (token, res, mysql) {
  let user = await _query(token, mysql)

  if ((user && user.length === 0) || Object.keys(user).length === 0) {
    throw new Error('User not exists')
  } 
  
  return user
}
