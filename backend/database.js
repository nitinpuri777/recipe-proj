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
            userId:1,
          ingredients: ["1000g flour", "200g Cheese"],
          steps: ["Make the dough", "Spread the dough out", "Put the sauce on the pizza","Put the cheese on the pizza"]
      },
      {
          id:2,
          name: "Taco",
          userId: 2,
          ingredients: ["4 tortillas", "0.5lb Beef"],
          steps: ["Open the tortilla", "Put the beef in the tortilla"]
      },
      {
          id:3,
          name: "Donut",
          userId: 2,
          ingredients: ["1000g flour", "500g Sugar"],
          steps: [ "Make the dough","Fry the dough","Cover it in sugar"]
      }
  ]

}

export default database