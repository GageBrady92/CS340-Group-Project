
// Get the objects we need to modify
let updateChefForm = document.getElementById('update-chef-form-ajax');

// Modify the objects we need
updateChefForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputChef = document.getElementById("mySelect");
    let inputFirstName = document.getElementById("input-first-name-update");
    let inputLastName = document.getElementById("input-last-name-update");
    let inputEmail = document.getElementById("input-email-update");
    let inputChefLocation = document.getElementById("input-chef-location-update");

    // Get the values from the form fields
    let chefValue = inputChef.value
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let emailValue = inputEmail.value;
    let chefLocationValue = inputChefLocation.value;

    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    // if (isNaN(firstNameValue)) 
    // {
    //     return;
    // }


    // Put our data we want to send in a javascript object
    let data = {
        chef_id: chefValue,
        first_name: firstNameValue,
        last_name: lastNameValue,
        email: emailValue,
        restaurant_id: chefLocationValue,
    }
    console.log(data)
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-chef-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, chefValue);
            // chefValue.value = '';
            // inputFirstName.value = '';
            // inputLastName.value = '';
            // inputEmail.value = '';
            // inputChefLocation.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function updateRow(data, chefID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("chefs-table");
    console.log(table)
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == chefID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let firstName = updateRowIndex.getElementsByTagName("td")[2];
            let lastName = updateRowIndex.getElementsByTagName("td")[3];
            let email = updateRowIndex.getElementsByTagName("td")[4];
            let location = updateRowIndex.getElementsByTagName("td")[5];

            // Reassign homeworld to our value we updated to
            firstName.innerHTML = parsedData[0].first_name;
            lastName.innerHTML = parsedData[0].last_name; 
            email.innerHTML = parsedData[0].email; 
            location.innerHTML = parsedData[0].restaurant_id;  
       }
    }
    window.location.reload();
}