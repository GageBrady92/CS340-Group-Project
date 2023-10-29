-- Cookbooks with Team 1
-- Daniel Brady
-- Aubrey Floyd


-- SELECT for every table
-- select all restaurants
SELECT restaurant_id, location, food_type FROM Restaurants;
-- select all chefs
SELECT c.chef_id, c.first_name, c.last_name, c.email, r.location AS restaurant_location
FROM Chefs AS c
INNER JOIN Restaurants AS r ON c.restaurant_id = r.id;
-- select all recipes
SELECT recipe_id, recipe_name, recipe_description, cook_time, food_category, recipe_steps FROM Recipes;
-- select all ingredients
SELECT ingredient_id, ingredient_name, ingredient_description FROM Ingredients;
-- select all chef recipe relationships
SELECT chefs_recipes_details_id, chef_id, recipe_id FROM ChefsRecipesDetails;
-- select all recipe ingredient relationships
SELECT recipe_ingredient_details_id, recipe_id, ingredient_id, quantity, unit_measurement FROM RecipeIngredientDetails;


-- INSERT into every table
-- insert new restaurant
INSERT INTO Restaurants (location, food_type) VALUES (:location, :food_type);
-- insert new chef
INSERT INTO Chefs (first_name, last_name, email, restaurant_id) VALUES (:first_name, :last_name, :email, :restaurant_id);
-- insert new recipe
INSERT INTO Recipes (recipe_name, recipe_description, cook_time, food_category, recipe_steps) VALUES (:recipe_name, :recipe_description, :cook_time, :food_category, :recipe_steps);
-- insert new ingredient
INSERT INTO Ingredients (ingredient_name, ingredient_description) VALUES (:ingredient_name, :ingredient_description);
-- insert new chef recipe relationship
INSERT INTO ChefsRecipesDetails (chef_id, recipe_id) VALUES (:chef_id, :recipe_id);
-- insert new recipe ingredient relationship
INSERT INTO RecipeIngredientDetails (recipe_id, ingredient_id, quantity, unit_measurement) VALUES (:recipe_id, :ingredient_id, :quantity, :unit_measurement);


-- UPDATE (1 NULLable relationship)
-- update chefs information
UPDATE Chefs SET first_name = :first_name, last_name = :last_name, email = :email, restaurant_id = :restaurant_id WHERE chef_id = :chef_id;


-- 1 DELETE (M:M)
-- delete chef
DELETE FROM Chefs WHERE chef_id = :chef_id;
-- Remove ingredient from recipe
DELETE FROM RecipeIngredientDetails WHERE recipe_id = :recipe_id AND ingredient_id = :ingredient_id


