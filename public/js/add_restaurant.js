// // Get the objects we need to modify
// let addRestaurantForm = document.getElementById('add-restaurant-form-ajax');

// // Modify the objects we need
// addRestaurantForm.addEventListener("submit", function (e) {
    
//     // Prevent the form from submitting
//     e.preventDefault();

//     // Get form fields we need to get data from
//     let inputLocation = document.getElementById("input-location");
//     let inputFoodType = document.getElementById("input-food-type");

//     // Get the values from the form fields
//     let firstLocationValue = inputLocation.value;
//     let lastFoodTypeValue = inputFoodType.value;

//     // Put our data we want to send in a javascript object
//     let data = {
//         location: firstLocationValue,
//         food_type: lastFoodTypeValue
//     }
    
//     // Setup our AJAX request
//     var xhttp = new XMLHttpRequest();
//     xhttp.open("POST", "/add-restaurant-ajax", true);
//     xhttp.setRequestHeader("Content-type", "application/json");

//     // Tell our AJAX request how to resolve
//     xhttp.onreadystatechange = () => {
//         if (xhttp.readyState == 2 && xhttp.status == 200) {

//             // Add the new data to the table
//             addRowToTable(xhttp.response);

//             // Clear the input fields for another transaction
//             inputLocation.value = '';
//             inputFoodType.value = '';
//         }
//         else if (xhttp.readyState == 2 && xhttp.status != 200) {
//             console.log("There was an error with the input.")
//         }
//     }

//     // Send the request and wait for the response
//     xhttp.send(JSON.stringify(data));

// })


// // Creates a single row from an Object representing a single record from 
// // bsg_people
// addRowToTable = (data) => {

//     // Get a reference to the current table on the page and clear it out.
//     let currentTable = document.getElementById("restaurant-table");

//     // Get the location where we should insert the new row (end of table)
//     let newRowIndex = currentTable.rows.length;

//     // Get a reference to the new row from the database query (last object)
//     let parsedData = JSON.parse(data);
//     let newRow = parsedData[parsedData.length - 1]

//     // Create a row and 2 cells
//     let row = document.createElement("TR");
//     let restaurant_idCell = document.createElement("TD");
//     let locationCell = document.createElement("TD");
//     let foodTypeCell = document.createElement("TD");

//     // Fill the cells with correct data
//     restaurant_idCell.innerText = newRow.id;
//     locationCell.innerText = newRow.location;
//     foodTypeCell.innerText = newRow.food_type;

//     // Add the cells to the row 
//     row.appendChild(restaurant_idCell);
//     row.appendChild(locationCell);
//     row.appendChild(foodTypeCell);
    
//     // Add the row to the table
//     currentTable.appendChild(row);
// }