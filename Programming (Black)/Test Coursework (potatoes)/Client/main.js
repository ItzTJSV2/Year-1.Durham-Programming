document.getElementById("GET").addEventListener("click", async function() {
    console.log("Element with id 'GET' was clicked");
    queryValue = document.getElementById("inputQuery").value;
    console.log("Query Value: " + queryValue);
    json = await getRecipe(queryValue);
    console.log(json)
    document.getElementById("h1Title").innerHTML = json.title;
    document.getElementById("Servings").innerHTML = json.servings;


    IngredString = json.ingredients;
    IngredArray = IngredString.split("|");
    for (x = 0; x<=IngredArray.length; x++){
        document.getElementById("Ingredients List").innerHTML += "\u2022" + IngredArray[x] + "<br/>";
    }

    document.getElementById("Instructions").innerHTML = json.instructions;
});


async function getRecipe(query) {
    const url = 'http://127.0.0.1:8080/recipe?max=' + query;
    console.log("Attempt to fetch from: " + url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log("Error!")
            throw new Error('Network response was not ok.  Code: ' , response.status);
        }
        const returnValue = await response.json();
        return returnValue;
    } catch (error) {
        console.log(error.message);
    }
}