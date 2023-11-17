
// Get the objects we need to modify
let updateRecipeForm = document.getElementById('update-recipe-form-ajax');

// Modify the objects we need
updateRecipeForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRecipe= document.getElementById("mySelect");
    let inputRecipeName= document.getElementById("input-recipe-name-update");
    let inputRecipeDescription= document.getElementById("input-recipe-description-update");
    let inputCookTime= document.getElementById("input-cook-time-update");
    let inputFoodCategory= document.getElementById("input-food-category-update");
    let inputRecipeSteps= document.getElementById("input-recipe-steps-update");

    // Get the values from the form fields
    let recipeValue = inputRecipe.value;
    let recipeNameValue = inputRecipeName.value;
    let recipeDescriptionValue = inputRecipeDescription.value;
    let cookTimeValue = inputCookTime.value;
    let foodCategoryValue = inputFoodCategory.value;
    let recipeStepsValue = inputRecipeSteps.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    // if (isNaN(foodTypeValue)) 
    // {
    //     return;
    // }


    // Put our data we want to send in a javascript object
    let data = {
        recipe_id: recipeValue,
        recipe_name: recipeNameValue ,
        recipe_description: recipeDescriptionValue ,
        cook_time: cookTimeValue,
        food_category: foodCategoryValue,
        recipe_steps: recipeStepsValue,
    }
    console.log(data)
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-recipe-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, recipeValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, recipeID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("recipes-table");
    console.log(table)
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == recipeID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let recipeName = updateRowIndex.getElementsByTagName("td")[2];
            let recipeDescription = updateRowIndex.getElementsByTagName("td")[3];
            let cookTime = updateRowIndex.getElementsByTagName("td")[4];
            let foodCategory = updateRowIndex.getElementsByTagName("td")[5];
            let recipeSteps= updateRowIndex.getElementsByTagName("td")[6];

            // Reassign homeworld to our value we updated to
            recipeName.innerHTML = parsedData[0].recipe_name;
            recipeDescription.innerHTML = parsedData[0].recipe_description; 
            cookTime.innerHTML = parsedData[0].cook_time; 
            foodCategory.innerHTML = parsedData[0].food_category;
            recipeSteps.innerHTML = parsedData[0].recipe_steps;  
       }
    }
    window.location.reload();
}