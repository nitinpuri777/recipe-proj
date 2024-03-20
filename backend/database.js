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
          userId: 1,
          ingredients: ["1000g flour", "200g Cheese"],
          steps: [
            {number: 1, description: "Make the dough"},
            {number: 2, description: "Put the cheese on the pizza"},
            {number: 3, description: ""}
          ]
      },
      {
          id:2,
          name: "Taco",
          userId: 2,
          ingredients: ["4 tortillas", "0.5lb Beef"],
          steps: [
            {number: 1, description: "Open the tortilla"},
            {number: 2, description: "Put the beef in the tortilla"},
          ]
      },
      {
          id:3,
          name: "Donut",
          userId: 2,
          ingredients: ["1000g flour", "500g Sugar"],
          steps: [
            {number: 1, description: "Make the dough"},
            {number: 2, description: "Fry the dough"},
            {number: 3, description: "Cover it in sugar"}
          ]
      }
  ]

}

export default database