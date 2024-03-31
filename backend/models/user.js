import { Model } from 'sequelize';

class User extends Model {
  static async findByToken(token) {
    return await User.findOne({
      where: {
        token: token
      }
    })
  }
  static async findValidUser(body) {
    if (!body.token) {
      return await User.findOne({
        where: {
          email: body.email,
          password: body.password
        }
      });
    } else {
      return await User.findOne({
        where: {
          token: body.token
        }
      });
    }
  }
  static async findId(user) {
    return user.id
  }
  static async findOrCreateByStytchUser(stytchUser) {
    let foundOrCreated = await User.findOrCreate({
      where:{
        stytchUserId: stytchUser.user_id
      },
      defaults: {
        name: stytchUser.name.first_name + " " + stytchUser.name.last_name,
        email: stytchUser.emails[0].email,
      },
      raw: true
    })
    let user = foundOrCreated[0] // Need this because it returns array to tell you if found or created in addition to result
    // let user = userInstance.user.dataValues
    return user
  }

}


export default User