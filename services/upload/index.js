'use strict'

const {
  uploadGeoData: uploadGeoDataSchema
} = require('./shemas')

module.exports = function (fastify, opts, next) {
  fastify.addHook('preHandler', fastify.authPreHandler)

  fastify.post('/upload/file/check/occurrence', {
    schema: uploadGeoDataSchema
  }, uploadGeoDataHandler)

  next()
}


module.exports[Symbol.for('plugin-meta')] = {
  decorators: {
    fastify: [
      'authPreHandler',
      'uploadGeoDataService'
    ]
  }
}

async function uploadGeoDataHandler(req, reply) {

  return this.uploadGeoDataService.uploadData(req.raw.files)
    .then(res => {
      reply.send({
        code: 201,
        error: false,
        data: res
      })
    })

}