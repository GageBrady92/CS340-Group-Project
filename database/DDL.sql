-- Cookbooks with Team 1
-- Daniel Brady
-- Aubrey Floyd


-- disable foreign key checks and auto-commit
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;


-- create the Restaurants table
DROP TABLE IF EXISTS Restaurants;
CREATE TABLE Restaurants (
    restaurant_id INT(11) NOT NULL AUTO_INCREMENT,
    location VARCHAR(255) NOT NULL,
    food_type VARCHAR(255) NOT NULL,
    PRIMARY KEY (restaurant_id)
);

-- create the Chefs table
DROP TABLE IF EXISTS Chefs;
CREATE TABLE Chefs (
    chef_id INT(11) NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    email VARCHAR(25) NOT NULL,
    restaurant_id INT(11) NOT NULL,
    PRIMARY KEY (chef_id),
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id)
    ON DELETE CASCADE
);

-- create the Recipes table
DROP TABLE IF EXISTS Recipes;
CREATE TABLE Recipes (
    recipe_id INT(11) NOT NULL AUTO_INCREMENT,
    recipe_name VARCHAR(25) NOT NULL,
    recipe_description VARCHAR(255) NOT NULL,
    cook_time VARCHAR(25) NOT NULL,
    food_category VARCHAR(25),
    recipe_steps VARCHAR(255) NOT NULL,
    PRIMARY KEY (recipe_id)
);

-- create the ChefsRecipesDetails intersection table
DROP TABLE IF EXISTS ChefsRecipesDetails;
CREATE TABLE ChefsRecipesDetails (
    chefs_recipes_details_id INT(11) NOT NULL AUTO_INCREMENT,
    chef_id INT(11) NOT NULL,
    recipe_id INT(11) NOT NULL,
    PRIMARY KEY (chefs_recipes_details_id),
    FOREIGN KEY (chef_id) REFERENCES Chefs(chef_id)
    ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id)
    ON DELETE CASCADE
);

-- create the Ingredients table
DROP TABLE IF EXISTS Ingredients;
CREATE TABLE Ingredients (
    ingredient_id INT(11) NOT NULL AUTO_INCREMENT,
    ingredient_name VARCHAR(255) NOT NULL,
    ingredient_description VARCHAR(255) NOT NULL,
    PRIMARY KEY(ingredient_id)
);

-- create the RecipeIngredientDetails intersection table
DROP TABLE IF EXISTS RecipeIngredientDetails;
CREATE TABLE RecipeIngredientDetails (
    recipe_ingredient_details_id INT(11) NOT NULL AUTO_INCREMENT,
    recipe_id INT(11),
    ingredient_id INT(11),
    quantity INT(11) NOT NULL,
    unit_measurement VARCHAR(255) NOT NULL,
    PRIMARY KEY (recipe_ingredient_details_id),
    FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id)
    ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id)
    ON DELETE CASCADE
);



-- insert data into the Restaurants table
INSERT INTO Restaurants (location, food_type) 
VALUES ('Mexican Restaurant', 'Mexican'),
    ('Indian Restaurant', 'Indian'),
    ('Italian Restaurant', 'Italian'),
    ('American Restaurant', 'American');

-- insert data into the Chefs table
INSERT INTO Chefs (first_name, last_name, email, restaurant_id) 
VALUES ('Adam', 'Smith', 'adamsmith@example.com', 1),
    ('Betty', 'Gomez', 'bettygomez@example.com', 2),
    ('Carl', 'Walker', 'carlwalker@example.com', 3);

-- insert data into the Recipes table
INSERT INTO Recipes (recipe_name, recipe_description, cook_time, food_category, recipe_steps)
VALUES ('Salsa', 'Fresh salsa recipe', '15 minutes', 'Appetizer', 'Step 1: ...'),
    ('Chicken Tikka Masala', 'Chicken curry dish', '45 minutes', 'Entree', 'Step 1: ...'),
    ('House Salad', 'Fresh house salad', '10 minutes', 'Salad', 'Step 1: ...');

-- insert data into the ChefsRecipesDetails intersection table
INSERT INTO ChefsRecipesDetails (chef_id, recipe_id)
VALUES (1, 3),
    (2, 1),
    (3, 2);

-- insert data into the Ingredients table
INSERT INTO Ingredients (ingredient_name, ingredient_description)
VALUES ('Lettuce', 'Fresh head of lettuce leaves'),
    ('Chicken', 'Fresh chicken meat'),
    ('Tomato', 'Fresh whole tomato'),
    ('Lime', 'Fresh whole lime');

-- insert data into the RecipeIngredientDetails intersection table
INSERT INTO RecipeIngredientDetails (recipe_id, ingredient_id, quantity, unit_measurement)
VALUES (1, 1, 200, 'grams'),
    (2, 2, 1, 'whole'),
    (3, 3, 750, 'ml');


-- enable foreign key checks and commit
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

