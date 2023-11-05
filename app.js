/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

PORT = 10168;

// Database
var db = require('./database/db-connector');

// Handlebars
var exphbs = require('express-handlebars');
const { query } = require('express');
app.engine('.hbs', exphbs({
    extname: ".hbs"
}));
app.set('view engine', '.hbs');

// Static Files
app.use(express.static('public'));



/*
    ROUTES
*/
    
// app.js

app.get('/', function(req, res)
    {  
        let query1 = "SELECT * FROM Restaurants;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query                                        // will process this file, before sending the finished HTML to the client.



    app.post('/add-location-form', function(req, res){
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // // Capture NULL values
        // let homeworld = parseInt(data['input-homeworld']);
        // if (isNaN(homeworld))
        // {
        //     homeworld = 'NULL'
        // }
    
        // let age = parseInt(data['input-age']);
        // if (isNaN(age))
        // {
        //     age = 'NULL'
        // }
    
        // Create the query and run it on the database
        query1 = `INSERT INTO Restaurants (location, food_type) VALUES ('${data['input-location']}', '${data['input-food-type']}')`;
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
    })
    
    /*
        LISTENER
    */
    app.listen(PORT, function(){
        console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
    });