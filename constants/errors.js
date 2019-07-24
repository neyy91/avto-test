const ERRORS = {
    LOGIN_EXIST: {
      code: 401,
      message: 'This login already in use'
    },
    INVALID_INPUT_LOGIN_DATA: {
      code: 403,
      message: 'Login or password incorrect'
    }
  
  }
  
  module.exports = ERRORS
  