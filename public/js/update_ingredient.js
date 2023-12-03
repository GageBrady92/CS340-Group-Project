// 1 # Citation for the following page:
// 2 # Date: 11/20/2023
// 3 # Adapted from code
// 4 # Much of the format is from the node starter guide. Variables and table values original
// 5 # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateIngredientForm = document.getElementById('update-ingredient-form-ajax');

// Modify the objects we need
updateIngredientForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIngredient= document.getElementById("mySelect");
    let inputIngredientName= document.getElementById("input-ingredient-name-update");
    let inputIngredientDescription= document.getElementById("input-ingredient-description-update");

    // Get the values from the form fields
    let ingredientValue = inputIngredient.value;
    let ingredientNameValue = inputIngredientName.value;
    let ingredientDescriptionValue = inputIngredientDescription.value;
    
    // Put our data we want to send in a javascript object
    let data = {
        ingredient_id: ingredientValue,
        ingredient_name: ingredientNameValue ,
        ingredient_description: ingredientDescriptionValue ,
    }
    console.log(data)
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-ingredient-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, ingredientValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, ingredientID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("ingredients-table");
    console.log(table)
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == ingredientID) {

            // Get the location of the row where we found the matching ingredient ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of each value
            let ingredientName = updateRowIndex.getElementsByTagName("td")[2];
            let ingredientDescription = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign values we updated to
            ingredientName.innerHTML = parsedData[0].ingredient_name;
            ingredientDescription.innerHTML = parsedData[0].ingredient_description;   
       }
    }
    window.location.reload();
}