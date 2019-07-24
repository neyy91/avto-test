const _authToken = {
  type: 'object',
  required: ['Authorization'],
  properties: {
    'Authorization': {
      type: 'string'
    }
  }
}

const SHEMA = {
  authToken: _authToken,
}

module.exports = SHEMA