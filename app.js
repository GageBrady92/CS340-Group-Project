// 1 # Citation for the following page:
// 2 # Date: 11/20/2023
// 3 # Copied from /OR/ Adapted from /OR/ Based on 
// 4 # Much of the format is from the node starter guide. Variables and SQL for tables are original
// 5 # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
 
PORT = 10167;
 
// Database
var db = require('./database/db-connector');
 
// Handlebars
var exphbs = require('express-handlebars');
const { query } = require('express');
app.engine('.hbs', exphbs.engine({
    extname: ".hbs"
}));
app.set('view engine', '.hbs');
 
// Static Files
app.use(express.static('public'));
 
/*
    ROUTES
*/

// Home route
app.get('/', function(req, res)
    {
        res.render('index');                    
    });                                         


//Restaurants js///////////////////////////////////////
app.get('/restaurants', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.location === undefined)
    {
        query1 = "SELECT * FROM Restaurants;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Restaurants WHERE location LIKE "${req.query.location}%"`
    }

    db.pool.query(query1, function(error, rows, fields){
        
        let location = rows;

            return res.render('restaurants', {data: location});
    })
});
    
    app.post('/add-location-form', function(req, res){
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Create the query and run it on the database
        query1 = `INSERT INTO Restaurants (location, food_type) VALUES ('${data["input-location"]}', '${data["input-food-type"]}')`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
    
            // If there was no error, we redirect back to our page, which automatically runs the SELECT * FROM Restaurants and
            // presents it on the screen
            else
            {
                res.redirect('/restaurants');
            }
        })
    })

    app.delete('/delete-restaurant-ajax/', function (req, res, next) {
        let data = req.body;
        let restaurantID = parseInt(data.restaurant_id);
        let deleteRestaurant = `DELETE FROM Restaurants WHERE restaurant_id = ?`;
    
        // Run the 1st query
        db.pool.query(deleteRestaurant, [restaurantID], function (error, rows, fields) {
            if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        });
    });

    
app.put('/put-restaurant-ajax', function(req,res,next){
    let data = req.body;
    
    let location = parseInt(data.restaurant_id);
    let foodType = data.food_type;
    
    let queryUpdateRestaurant = `UPDATE Restaurants SET Restaurants.food_type = '${foodType}' WHERE Restaurants.restaurant_id = '${location}';`;
    let selectRestaurant = `SELECT * FROM Restaurants WHERE Restaurants.restaurant_id = '${location}';`
    
            // Run the 1st query
            db.pool.query(queryUpdateRestaurant, [location, foodType], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                // If there was no error, we run our second query and return that data so we can use it to update the restaurant
                // table on the front-end
                else
                {
                    // Run the second query
                    db.pool.query(selectRestaurant, [location], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })});


//Chefs js/////////////////////////////////////////////////////////

app.get('/chefs', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.last_name === undefined)
    {
        query1 = `SELECT Chefs.chef_id, Chefs.first_name, Chefs.last_name, Chefs.email, Chefs.restaurant_id, Restaurants.location
        FROM Chefs
        INNER JOIN Restaurants ON Chefs.restaurant_id = Restaurants.restaurant_id;`;
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Chefs WHERE last_name LIKE "${req.query.last_name}%"`
    }
    
    let query2 = 'SELECT * from Restaurants'
    db.pool.query(query1, function(error, rows, fields){
        
        let chefs = rows;

        db.pool.query(query2, function(error, rows, fields){
        
            let restaurants = rows;

            return res.render('chefs', {data: chefs, restaurants: restaurants});
        })
    })
});

app.post('/add-chef-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Chefs (first_name, last_name, email, restaurant_id ) VALUES ('${data["input-first-name"]}', '${data["input-last-name"]}','${data["input-email"]}','${data["input-chef-location"]}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to chef page, which automatically runs the SELECT * chefs and
        // presents it on the screen
        else
        {
            res.redirect('/chefs');
        }
    })
});

app.delete('/delete-chef-ajax/', function(req,res,next){
    let data = req.body;
    let chefID = parseInt(data.chef_id);
    let deleteChefsRecipesDetails = `DELETE FROM ChefsRecipesDetails WHERE chef_id = ?`;
    let deleteChefs = `DELETE FROM Chefs WHERE chef_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteChefsRecipesDetails, [chefID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteChefs, [chefID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

  app.put('/put-chef-ajax', function(req,res,next){
    let data = req.body;
    
    let chef = parseInt(data.chef_id);
    let firstName = data.first_name;
    let lastName = data.last_name;
    let chefEmail= data.email;
    let chefLocation = parseInt(data.restaurant_id);
    
    let queryUpdateChef = `UPDATE Chefs SET Chefs.first_name = '${firstName}', Chefs.last_name = '${lastName}', Chefs.email = '${chefEmail}', Chefs.restaurant_id = '${chefLocation}'  WHERE Chefs.chef_id = '${chef}';`;
    let selectChef = `SELECT * FROM Chefs WHERE Chefs.chef_id = '${chef}';`
    
            // Run the 1st query
            db.pool.query(queryUpdateChef, [firstName, lastName, chefEmail, chefLocation], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                // If there was no error, we run our second query and return that data so we can use it to update the chef
                // table on the front-end
                else
                {
                    // Run the second query
                    db.pool.query(selectChef, [chef], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })});

//Recipes js//////////////////////////////////////
app.get('/recipes', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.recipe_name === undefined)
    {
        query1 = "SELECT * FROM Recipes;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Recipes WHERE recipe_name LIKE "${req.query.recipe_name}%"`
    }
    console.log(query1)
    db.pool.query(query1, function(error, rows, fields){
        
        let recipe_name = rows;

            return res.render('recipes', {data: recipe_name});
    

    })
});


app.post('/add-recipe-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Recipes (recipe_name, recipe_description, cook_time, food_category, recipe_steps ) VALUES ('${data["input-recipe-name"]}', '${data["input-recipe-description"]}','${data["input-cook-time"]}','${data["input-food-category"]}','${data["input-recipe-steps"]}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM recipes and
        // presents it on the screen
        else
        {
            res.redirect('/recipes');
        }
    })
});

app.put('/put-recipe-ajax', function(req,res,next){
    let data = req.body;
    
    let recipe = parseInt(data.recipe_id);
    let recipeName = data.recipe_name;
    let recipeDescription = data.recipe_description;
    let cookTime = data.cook_time;
    let foodCategory = data.food_category;
    let recipeSteps = data.recipe_steps;
    
    let queryUpdateRecipe = `UPDATE Recipes SET Recipes.recipe_name = '${recipeName}', Recipes.recipe_description= '${recipeDescription}', Recipes.cook_time = '${cookTime }', Recipes.food_category = '${foodCategory}', Recipes.recipe_steps = '${recipeSteps}'  WHERE Recipes.recipe_id = '${recipe}';`;
    let selectRecipe = `SELECT * FROM Recipes WHERE Recipes.recipe_id = '${recipe}';`
    
            // Run the 1st query
            db.pool.query(queryUpdateRecipe, [recipeName, recipeDescription, cookTime, foodCategory, recipeSteps], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                // If there was no error, we run our second query and return that data so we can use it to update the recipe
                // table on the front-end
                else
                {
                    // Run the second query
                    db.pool.query(selectRecipe, [recipe], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })});


    app.delete('/delete-recipe-ajax/', function(req,res,next){
        let data = req.body;
        let recipeID = parseInt(data.recipe_id);
        let deleteChefsRecipesDetails = `DELETE FROM ChefsRecipesDetails WHERE recipe_id = ?`;
        let deleteRecipe = `DELETE FROM Recipes WHERE recipe_id = ?`;
      
      
              // Run the 1st query
              db.pool.query(deleteChefsRecipesDetails, [recipeID], function(error, rows, fields){
                  if (error) {
      
                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
                  }
      
                  else
                  {
                      // Run the second query
                      db.pool.query(deleteRecipe, [recipeID], function(error, rows, fields) {
      
                          if (error) {
                              console.log(error);
                              res.sendStatus(400);
                          } else {
                              res.sendStatus(204);
                          }
                      })
                  }
      })});
    

// Ingredients js/////////////////////////////////////////////////
app.get('/ingredients', function(req, res)
{  
    let queryIngredients = "SELECT * FROM Ingredients;";              

    db.pool.query(queryIngredients, function(error, rows, fields){

        res.render('ingredients', {data: rows});                  
    })                                                      
}); 

app.post('/add-ingredient-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Ingredients (ingredient_name, ingredient_description ) VALUES ('${data["input-ingredient-name"]}', '${data["input-ingredient-description"]}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our ingredient page, which automatically runs the SELECT * FROM ingredient and
        // presents it on the screen
        else
        {
            res.redirect('/ingredients');
        }
    })
});

app.put('/put-ingredient-ajax', function(req,res,next){
    let data = req.body;
    
    let ingredient = parseInt(data.ingredient_id);
    let ingredientName = data.ingredient_name;
    let ingredientDescription = data.ingredient_description;
    
    let queryUpdateIngredient = `UPDATE Ingredients SET Ingredients.ingredient_name = '${ingredientName}', Ingredients.ingredient_description= '${ingredientDescription}' WHERE ingredient_id = '${ingredient}'`;
    let selectIngredient = `SELECT * FROM Ingredients WHERE Ingredients.ingredient_id = '${ingredient}';`
    
            // Run the 1st query
            db.pool.query(queryUpdateIngredient, [ingredientName, ingredientDescription], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                // If there was no error, we run our second query and return that data so we can use it to update the ingredient
                // table on the front-end
                else
                {
                    // Run the second query
                    db.pool.query(selectIngredient, [ingredient], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })});


    app.delete('/delete-ingredient-ajax/', function(req,res,next){
        let data = req.body;
        let ingredientID = parseInt(data.ingredient_id);
        let deleteRecipeIngredientDetails = `DELETE FROM RecipeIngredientDetails WHERE ingredient_id = ?`;
        let deleteIngredient = `DELETE FROM Ingredients WHERE ingredient_id = ?`;
      
      
              // Run the 1st query
              db.pool.query(deleteRecipeIngredientDetails, [ingredientID], function(error, rows, fields){
                  if (error) {
      
                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
                  }
      
                  else
                  {
                      // Run the second query
                      db.pool.query(deleteIngredient, [ingredientID], function(error, rows, fields) {
      
                          if (error) {
                              console.log(error);
                              res.sendStatus(400);
                          } else {
                              res.sendStatus(204);
                          }
                      })
                  }
      })});

// Chef Recipes js //////////////////////////
app.get('/chef_recipes', function(req, res)
{
    // Declare Query 1
    let query1 = `SELECT ChefsRecipesDetails.chefs_recipes_details_id , ChefsRecipesDetails.chef_id, Chefs.first_name, Chefs.last_name, ChefsRecipesDetails.recipe_id, Recipes.recipe_name 
    FROM ChefsRecipesDetails 
    INNER JOIN Chefs ON ChefsRecipesDetails.chef_id = Chefs.chef_id
    INNER JOIN Recipes ON ChefsRecipesDetails.recipe_id = Recipes.recipe_id
    ORDER BY ChefsRecipesDetails.chefs_recipes_details_id ASC;`;

    let query2 = "SELECT * FROM Chefs;";

    let query3 = "SELECT * FROM Recipes;";

    console.log(query1)
    db.pool.query(query1, function(error, rows, fields){
        
        let chef_recipes_details = rows;

        db.pool.query(query2, function(error, rows, fields){
        
            let chefs = rows;

            db.pool.query(query3, function(error, rows, fields){
        
                let recipes = rows;

            return res.render('chef_recipes', {data: chef_recipes_details, chefs: chefs, recipes: recipes});
            })
        })

    })
});

app.post('/add-chef-recipe-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO ChefsRecipesDetails(chef_id, recipe_id ) VALUES ('${data["input-chef-id"]}', '${data["input-chef-recipe-id"]}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our chef recipe page, which automatically runs the SELECT * FROM ChefsRecipesDetails and
        // presents it on the screen
        else
        {
            res.redirect('/chef_recipes');
        }
    })
});

app.delete('/delete-chef-recipe-ajax/', function(req,res,next){
    let data = req.body;
    let chefRecipeID = parseInt(data.chefs_recipes_details_id);
    let deleteChefsRecipesDetails = `DELETE FROM ChefsRecipesDetails WHERE chefs_recipes_details_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteChefsRecipesDetails, [chefRecipeID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteChefsRecipesDetails, [chefRecipeID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

// Recipe Ingredient js //////////////////////////
app.get('/recipe_ingredients', function(req, res)
{
    // Declare Query 1
    let query1 = `SELECT RecipeIngredientDetails.recipe_ingredient_details_id, RecipeIngredientDetails.recipe_id, RecipeIngredientDetails.ingredient_id,
    RecipeIngredientDetails.quantity, RecipeIngredientDetails.unit_measurement, Recipes.recipe_name, Ingredients.ingredient_name 
    FROM RecipeIngredientDetails 
    INNER JOIN Recipes ON RecipeIngredientDetails.recipe_id = Recipes.recipe_id
    INNER JOIN Ingredients ON RecipeIngredientDetails.ingredient_id = Ingredients.ingredient_id
    ORDER BY RecipeIngredientDetails.recipe_ingredient_details_id ASC;`;

    let query2 = `SELECT * FROM Recipes;`;

    let query3 = `SELECT * FROM Ingredients;`;

    db.pool.query(query1, function(error, rows, fields){
        
        let recipe_ingredients = rows;

        db.pool.query(query2, function(error, rows, fields){
        
            let recipes= rows;

            db.pool.query(query3, function(error, rows, fields){
        
                let ingredients = rows;

            return res.render('recipe_ingredients', {data: recipe_ingredients, recipes: recipes, ingredients: ingredients});
    
            })
        })
    })
});

app.post('/add-recipe-ingredient-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO RecipeIngredientDetails (recipe_id, ingredient_id, quantity, unit_measurement ) VALUES ('${data["input-recipe-id"]}', '${data["input-ingredient-id"]}', '${data["input-quantity"]}', '${data["input-unit-measurement"]}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our recipe ingredient page, which automatically runs the SELECT * FROM RecipeIngredientDetails and
        // presents it on the screen
        else
        {
            res.redirect('/recipe_ingredients');
        }
    })
});

app.delete('/delete-recipe-ingredient-ajax/', function(req,res,next){
    let data = req.body;
    let recipeIngredientID = parseInt(data.recipe_ingredient_details_id);
    let deleteRecipeIgredientDetails = `DELETE FROM RecipeIngredientDetails WHERE recipe_ingredient_details_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteRecipeIgredientDetails, [recipeIngredientID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteRecipeIgredientDetails, [recipeIngredientID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

  app.put('/put-recipe-ingredient-ajax', function(req,res,next){
    console.log('PUT request received');
    let data = req.body;
    
    let recipeIngredientID = parseInt(data.recipe_ingredient_details_id);
    let quantity = data.quantity;
    let unitMeasurement = data.unit_measurement;
    
    let queryUpdateRecipeIngredient = `UPDATE RecipeIngredientDetails SET RecipeIngredientDetails.quantity = '${quantity}', RecipeIngredientDetails.unit_measurement = '${unitMeasurement}' WHERE RecipeIngredientDetails.recipe_ingredient_details_id = '${recipeIngredientID}';`
    let selectRecipeIngredient = `SELECT * FROM RecipeIngredientDetails WHERE RecipeIngredientDetails.recipe_ingredient_details_id = '${recipeIngredientID}';`
    
            // Run the 1st query
            db.pool.query(queryUpdateRecipeIngredient, [quantity, unitMeasurement], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                // If there was no error, we run our second query and return that data so we can use it to update the recipe
                // table on the front-end
                else
                {
                    // Run the second query
                    db.pool.query(selectRecipeIngredient, [recipeIngredientID], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })});


/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});