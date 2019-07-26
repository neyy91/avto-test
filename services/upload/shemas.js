const SHEMA = require('../../constants/shemas')


const uploadGeoData = {
    headers: SHEMA.authToken,
    description: 'Api for upload file and check points in poligons',
    body: {
        //file
    },
    response: {
        201: {
            type: 'object',
            required: [],
            properties: {
                code: {
                    type: 'number'
                },
                error: {
                    type: 'boolean'
                },
                data: {
                    type: 'object',
                    required: [],
                    properties: {
                        countPointsInPoligon : {type: 'number'},
                        points : {
                            type : 'array',
                            items: {}
                        }
                    }
                }
            }
        }
    }
}

module.exports = {
    uploadGeoData
}