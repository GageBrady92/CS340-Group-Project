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
        res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });                                         // will process this file, before sending the finished HTML to the client.


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
    
            // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
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
    
    // let queryUpdateRestaurant = `UPDATE Restaurants SET location = ? WHERE Restaurants.restaurant_id = ?`;
    // let queryUpdateRestaurant = `UPDATE Restaurants SET food_type = ? WHERE restaurant_id = ?`;
    let queryUpdateRestaurant = `UPDATE Restaurants SET Restaurants.food_type = '${foodType}' WHERE Restaurants.restaurant_id = '${location}';`;
    let selectRestaurant = `SELECT * FROM Restaurants WHERE Restaurants.restaurant_id = '${location}';`
    
            // Run the 1st query
            db.pool.query(queryUpdateRestaurant, [location, foodType], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                // If there was no error, we run our second query and return that data so we can use it to update the people's
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
        query1 = "SELECT * FROM Chefs;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Chefs WHERE last_name LIKE "${req.query.last_name}%"`
    }
    
    db.pool.query(query1, function(error, rows, fields){
        
        let last_name = rows;

            return res.render('chefs', {data: chefs});
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

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
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
    
                // If there was no error, we run our second query and return that data so we can use it to update the people's
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

    db.pool.query(query1, function(error, rows, fields){
        
        let recipe = rows;

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

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
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
    
                // If there was no error, we run our second query and return that data so we can use it to update the people's
                // table on the front-end
                else
                {
                    // Run the second query
                    db.pool.query(selectRecipe, [chef], function(error, rows, fields) {
    
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
/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});