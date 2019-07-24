const SHEMA = require('../../constants/shemas')


const uploadGeoData = {
    headers: SHEMA.authToken,
    description: 'Api для загрузка файла с координатами',
    body: {
        type: 'object',
        required: [],
        properties: {
            //to do file
        }
    },
    response: {

    }
}

module.exports = {
    uploadGeoData
  }