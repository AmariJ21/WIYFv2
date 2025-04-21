const ingredientsInput = document.getElementById("ingredients");
const searchButton = document.getElementById("search-button");
const recipesContainer = document.getElementById("recipes");
const titleDiv = document.getElementById("title");

searchButton.addEventListener("click", async () => {
  const ingredients = ingredientsInput.value.trim();
  if (!ingredients) {
    alert("Please enter ingredients!");
    return;
  }

  try {
    const response = await fetch('/.netlify/functions/recipe-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) throw new Error("Error fetching recipes");
    const data = await response.json();
    displayRecipes(data);
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again later.");
  }
});

// Function to fetch full recipe details to get the correct source URL
async function fetchRecipeDetails(recipeId) {
  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error fetching recipe details");

    const data = await response.json();
    return data.sourceUrl || "#"; // Return source URL, fallback to "#" if not available
  } catch (error) {
    console.error(error);
    return "#"; // Return fallback URL if there's an error
  }
}

async function displayRecipes(recipes) {
  if (titleDiv) titleDiv.setAttribute("hidden", true);
  else console.warn("Warning: Element with ID 'title' not found.");

  recipesContainer.innerHTML = ""; // Clear previous results

  for (const recipe of recipes) {
    const sourceUrl = await fetchRecipeDetails(recipe.id); // Fetch correct recipe source

    const recipeElement = document.createElement("div");
    recipeElement.classList.add("recipe");

    recipeElement.innerHTML = `
      <h3><a href="${sourceUrl}" target="_blank">${recipe.title}</a></h3>
      <a href="${sourceUrl}" target="_blank">
        <img src="${recipe.image}" alt="${recipe.title}">
      </a>
      <p>Used Ingredients: ${recipe.usedIngredients.map(ingredient => ingredient.name).join(", ")}</p>
      <p>Needed Ingredients: ${recipe.missedIngredients.map(ingredient => ingredient.name).join(", ")}</p>
    `;

    recipesContainer.appendChild(recipeElement);
  }
}
