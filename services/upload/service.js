
class UploadGeoDataService {
    constructor(fastify) {
      this.fastify = fastify
    }

    async uploadData(dataIn) {
      console.log("----dataIn----",dataIn)
    }

}

module.exports = UploadGeoDataService