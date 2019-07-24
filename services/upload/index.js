'use strict'

const {
  uploadGeoData: uploadGeoDataSchema
} = require('./shemas')

module.exports = function (fastify, opts, next) {
 
  fastify.post('/upload', {
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
  const files = req.raw.files
  console.log(files)
  let fileArr = []
  for(let key in files){
    fileArr.push({
      name: files[key].name,
      mimetype: files[key].mimetype
    })
  }
  reply.send(fileArr)
  // return this.uploadGeoDataService.uploadData(req.body)
  //   .then(res => {
  //     reply.send({
  //       code: 201,
  //       error: false,
  //       data: res
  //     })
  //   })

}