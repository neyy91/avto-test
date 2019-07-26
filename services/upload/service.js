const _ = require('lodash')
const LIMIT = require('../../constants/limits')
class UploadGeoDataService {
  constructor(fastify) {
    this.fastify = fastify
  }

  async uploadData(files) {

    let dataFile = files.file.data.toString()

    // parse file
    let points = dataFile.split(/,|;|,|]|\[|\n|latitude:|longitude:/)

    let toNumberCheck = points.map(param => {
      return Number(param) ? Number(param) : param.toString().trim()
    }).filter(param => {
      if (param) return param
    })


    let arrayPoints = _.chunk(toNumberCheck, LIMIT.PROPERTIES_LOCATION_IN_FILE)

    let validPoints = arrayPoints.filter(point => {
      return point && point.length === LIMIT.PROPERTIES_LOCATION_IN_FILE
    })

    const connection = await this.fastify.mysql.getConnection()

    let values = ''
    let filename = "'" + files.file.name + "'"

    //prepare data points to insert in db
    validPoints.map((point, index) => {

      if (index == validPoints.length - 1) {
        values = values + ' ( ' + _prepareQuery(point) + filename + ' ); '
      } else {
        values = values + ' ( ' + _prepareQuery(point) + filename + ' ), '
      }

    })


    let query = 'INSERT INTO position_objects  (`longitude`,`latitude`, `city`, `point_name`,`from_file_name`) VALUES ' + values
    //inser data from txt file to db
    let insertResult = await connection.query(query, [])


    //select square data and insert data from input file
    let selectSquaresQuery = 'SELECT longitude,latitude FROM  position_squares WHERE index_squares=?'
    let selectInputData = 'SELECT id,longitude,latitude FROM  position_objects WHERE from_file_name=?  ORDER BY `id` DESC LIMIT ?'

    //test index in readMe
    let testIndex = 1

    let resultSquare = await connection.query(selectSquaresQuery, [testIndex])
    let resultInput = await connection.query(selectInputData, [files.file.name, insertResult[0].affectedRows])

    connection.release()

    let getPositionSquaresByIndex = resultSquare[0]
    let getPositionNewPoints = resultInput[0]

    // check points in square (poligon)
    let pointsInPolygon = getPositionNewPoints.filter(data => {

      let dataPoint = _.pick(data, ['longitude', 'latitude'])

      let arrayLongitudeSquare = _.map(getPositionSquaresByIndex, 'longitude')
      let arrayLatitudeSquare = _.map(getPositionSquaresByIndex, 'latitude')

      let inSquare = _checkPointInSquare(dataPoint.longitude, dataPoint.latitude, arrayLongitudeSquare, arrayLatitudeSquare)

      return inSquare
    })

    return {
      countPointsInPoligon: pointsInPolygon.length,
      points: pointsInPolygon
    }
  }

}

module.exports = UploadGeoDataService

function _prepareQuery(point) {
  let value = ''
  point.map((property, index) => {
    value = value + (_.isNumber(property) ? property : "'" + property + "'") + ', '
  })

  return value
}

function _checkPointInSquare(x, y, xp, yp) {
  npol = xp.length;
  j = npol - 1;
  var c = 0;
  for (i = 0; i < npol; i++) {
    if ((((yp[i] <= y) && (y < yp[j])) || ((yp[j] <= y) && (y < yp[i]))) &&
      (x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
      c = !c
    }
    j = i;
  }
  return c;
}