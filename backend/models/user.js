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

}


export default User