// 1 # Citation for the following page:
// 2 # Date: 11/20/2023
// 3 # Adapted from code
// 4 # Much of the format is from the node starter guide. Variables and table values original
// 5 # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateRestaurantForm = document.getElementById('update-restaurant-form-ajax');

// Modify the objects we need
updateRestaurantForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputLocation = document.getElementById("mySelect");
    let inputFoodType = document.getElementById("input-food-type-update");

    // Get the values from the form fields
    let locationValue = inputLocation.value;
    let foodTypeValue = inputFoodType.value;
    
    // Put our data we want to send in a javascript object
    let data = {
        restaurant_id: locationValue,
        food_type: foodTypeValue,
    }
    console.log(data)
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-restaurant-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, locationValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, restaurantID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("restaurant-table");
    console.log(table)
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == restaurantID) {

            // Get the location of the row where we found the matching restaurant ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of each value
            let td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign values we updated to
            td.innerHTML = parsedData[0].food_type; 
       }
    }
    window.location.reload();
}

