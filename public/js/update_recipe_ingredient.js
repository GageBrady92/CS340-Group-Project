// 1 # Citation for the following page:
// 2 # Date: 11/20/2023
// 3 # Adapted from code
// 4 # Much of the format is from the node starter guide. Variables and table values original
// 5 # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateRecipeIngredientForm = document.getElementById('update-recipe-ingredient-form-ajax');

// Modify the objects we need
updateRecipeIngredientForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRecipeIngredientId= document.getElementById("mySelect");
    let inputQuantity= document.getElementById("input-quantity-update");
    let inputUnitMeasurement= document.getElementById("input-unit-measurement-update");

    // Get the values from the form fields
    let recipeIngredientIdValue = inputRecipeIngredientId.value;
    let quantityValue = inputQuantity.value;
    let unitMeasurementValue = inputUnitMeasurement.value;
    
    // Put our data we want to send in a javascript object
    let data = {
        recipe_ingredient_details_id: recipeIngredientIdValue,
        quantity: quantityValue,
        unit_measurement: unitMeasurementValue,
    }

    console.log(data)
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-recipe-ingredient-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, recipeIngredientIdValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, recipeIngredientID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("recipe-ingredient-table");
    console.log(table)
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == recipeIngredientID) {

            // Get the location of the row where we found the matching recipe ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of each value
            let quantity = updateRowIndex.getElementsByTagName("td")[3];
            let unitMeasurement = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign values we updated to
            quantity.innerHTML = parsedData[0].quantity;
            unitMeasurement.innerHTML = parsedData[0].unit_measurement;  
       }
    }
    window.location.reload();
}