var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));
 
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
 
/*
    ROUTES
*/

app.get('/', function(req, res)
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

            return res.render('index', {data: location});
    })
});

app.get('/chefs', function(req, res)
    {  
        let queryChefs = "SELECT * FROM Chefs;";              

        db.pool.query(queryChefs, function(error, rows, fields){

            res.render('chefs', {data: rows});                  
        })                                                      
    }); 

app.get('/recipes', function(req, res)
    {  
        let queryRecipes = "SELECT * FROM Recipes;";              

        db.pool.query(queryRecipes, function(error, rows, fields){

            res.render('recipes', {data: rows});                  
        })                                                      
    }); 
  
    

//Add
   
app.post('/add-location-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Restaurants (location, food_type) VALUES ('${data["input-location"]}', '${data["input-food-type"]}');`;
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
            res.redirect('/');
            }
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

    // app.delete('/delete-person-ajax/', function(req,res,next){
    //     let data = req.body;
    //     let personID = parseInt(data.id);
    //     let deleteBsg_Cert_People = `DELETE FROM bsg_cert_people WHERE pid = ?`;
    //     let deleteBsg_People= `DELETE FROM bsg_people WHERE id = ?`;
      
      
    //           // Run the 1st query
    //           db.pool.query(deleteBsg_Cert_People, [personID], function(error, rows, fields){
    //               if (error) {
      
    //               // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
    //               console.log(error);
    //               res.sendStatus(400);
    //               }
      
    //               else
    //               {
    //                   // Run the second query
    //                   db.pool.query(deleteBsg_People, [personID], function(error, rows, fields) {
      
    //                       if (error) {
    //                           console.log(error);
    //                           res.sendStatus(400);
    //                       } else {
    //                           res.sendStatus(204);
    //                       }
    //                   })
    //               }
    //   })});
    
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



/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});