import database from '../database.js'

const User = {
  findByToken: async(token) => {
      let isValid = (user) => (user.token === token)
          return database.users.find(isValid)
  },

  findValidUser: async (body) => {
      if (!body.token) {
          let isValid = (user) => (user.email === body.email && user.password === body.password) 
          return database.users.find(isValid)
      }
      else {
          let isValid = (user) => (user.token === body.token)
          return database.users.find(isValid)
      }
  },
  findId: async (user) => {
      return user.id
  }
  
}

export default User