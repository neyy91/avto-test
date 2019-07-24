
const ERRORS = require('../../constants/errors')


class AuthService {
  constructor(fastify) {
    this.fastify = fastify
  }

  async registrationUser(dataUser) {

    const connection = await this.fastify.mysql.getConnection()

    let user = await this.fastify.FindUserByLogin(dataUser.login)

    if (user) throw await fastify.Errors(ERRORS.LOGIN_EXIST)

    let defaultUser = {
      login: dataUser.login,
      token:  _getNewToken(dataUser.login,this.fastify),
      password: this.fastify.CryptPassword(dataUser.password),
    }

    let result = await connection.query('INSERT INTO users SET ?', defaultUser)

    connection.release()

    if (result[0] && result[0].affectedRows === 1) {

      let redisData = _prepareRedisData(defaultUser.token, defaultUser )
      await this.fastify.AddTockenToRedis(redisData)

      return defaultUser
    } else {
      throw await fastify.Errors(ERRORS.INVALID_INPUT_LOGIN_DATA)
    }

   
  }

  async loginUser(dataUser, auth) {
    let user = await this.fastify.UserLoginCheck(dataUser)

    if ((user && !user.token) || !auth) {
      let token =  _getNewToken(dataUser.login, this.fastify)
      user.token = token

      const connection = await this.fastify.mysql.getConnection()


      await connection.query(
        'UPDATE users SET token=? WHERE id=?', [token, user.id]
      )

      let redisData = _prepareRedisData(token, user )
      await this.fastify.AddTockenToRedis(redisData)

      connection.release()
    }
    
   
    return user
  }

  async logoutUser(token, auth) {
   

    if (this.fastify.redis.get(token)) {
      const connection = await this.fastify.mysql.getConnection()

      await this.fastify.DeleteKeyFromRedis(token)
      await connection.query(
        'UPDATE users SET token=? WHERE id=?', [null, auth]
      )

      connection.release()
      
      return {
        success : true
      }
    } else return {
      success : false
    }
  
  }
}

module.exports = AuthService

function _getNewToken(login, fastify) {
  const token = fastify.jwt.sign({
    login: login
  })
  return token
}

function _prepareRedisData(token, userdata) {
  let data = {
    token : token,
    userDara: JSON.stringify(userdata)
  }

  return data
}