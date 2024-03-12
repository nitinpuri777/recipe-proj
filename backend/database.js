const database = {
  users: [
      {
          id: 1,
          name: "Nitin Puri",
          email: "nitin@gmail.com",
          password: "nitinPass",
          token: "nitinToken"

      }, 
      {
          id: 2,
          name: "Ryan Haskell-Glatz",
          email: "ryan@gmail.com",
          password: "ryanPass",
          token: "ryanToken"

      }
  ],
  recipes: [
      {
          id:1,
          name: "Pizza",
          userId: 1
      },
      {
          id:2,
          name: "Taco",
          userId: 2
      },
      {
          id:3,
          name: "Donut",
          userId: 2
      }
  ]

}

export default database