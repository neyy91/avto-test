
const SHEMA = require('../../constants/shemas')
const LIMIT = require('../../constants/limits')

const _bodyAuth = {
  type: 'object',
  required: ['login', 'password'],
  properties: {
    login: { type: 'string', min: LIMIT.MIN_LENGTH_LOGIN, max: LIMIT.MAX_LENGTH_LOGIN },
    password: { type: 'string', min: LIMIT.MIN_LENGTH_LOGIN, max: LIMIT.MAX_LENGTH_LOGIN }
  }
}

const registration = {
  description: 'Регистрация пользователя',
  body: _bodyAuth,
  response: {}
}

const login = {
  description: 'Авторизация в приложении',
  body: _bodyAuth,
  response:{}
}

const logout = {
  description: 'Выход из текущего аккаунта',
  headers: SHEMA.authToken,
  response:{}
}

module.exports = {
  registration,
  login,
  logout
}
