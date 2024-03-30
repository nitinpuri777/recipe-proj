INSERT INTO Users (name, email, password, token, createdAt, updatedAt) VALUES
('Nitin Puri', 'nitin@gmail.com', 'nitinPass', 'nitinToken', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ryan Haskell-Glatz', 'ryan@gmail.com', 'ryanPass', 'ryanToken', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO Recipes (name, userId, ingredients, steps, createdAt, updatedAt) VALUES
('Pizza', 1, '["1000g flour", "200g Cheese"]', '["Make the dough", "Spread the dough out", "Put the sauce on the pizza", "Put the cheese on the pizza"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Taco', 2, '["4 tortillas", "0.5lb Beef"]', '["Open the tortilla", "Put the beef in the tortilla"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Donut', 2, '["1000g flour", "500g Sugar"]', '["Make the dough", "Fry the dough", "Cover it in sugar"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
