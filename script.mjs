const ingredientsInput = document.getElementById("ingredients");
const searchButton = document.getElementById("search-button");
const recipesContainer = document.getElementById("recipes");
const loadingSpinner = document.getElementById("loading-spinner");

searchButton.addEventListener("click", async () => {
  const ingredients = ingredientsInput.value.trim();
  if (!ingredients) {
    alert("Please enter ingredients!");
    return;
  }

  try {
    // Show loading spinner
    if (loadingSpinner) loadingSpinner.style.display = "block";
    
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
  } finally {
    // Hide loading spinner
    if (loadingSpinner) loadingSpinner.style.display = "none";
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
  recipesContainer.innerHTML = ""; // Clear previous results

  for (const recipe of recipes) {
    const recipeElement = document.createElement("div");
    recipeElement.classList.add("recipe-card");

    recipeElement.innerHTML = `
      <h3><a href="${recipe.sourceUrl}" target="_blank">${recipe.title}</a></h3>
      <a href="${recipe.sourceUrl}" target="_blank">
        <img src="${recipe.image}" alt="${recipe.title}">
      </a>
      <p>Used Ingredients: ${recipe.usedIngredients.map(ingredient => ingredient.name).join(", ")}</p>
      <p>Needed Ingredients: ${recipe.missedIngredients.map(ingredient => ingredient.name).join(", ")}</p>
    `;

    recipesContainer.appendChild(recipeElement);
  }
}
