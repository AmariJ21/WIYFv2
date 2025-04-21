const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { ingredients } = JSON.parse(event.body);
  const apiKey = process.env.SPOONACULAR_API_KEY;

  try {
    // Search for recipes by ingredients
    const searchUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&ranking=1&ignorePantry=true&apiKey=${apiKey}`;
    const searchResponse = await fetch(searchUrl);
    const recipes = await searchResponse.json();

    // Fetch detailed information for each recipe
    const detailedRecipes = await Promise.all(
      recipes.map(async (recipe) => {
        const detailsUrl = `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`;
        const detailsResponse = await fetch(detailsUrl);
        const details = await detailsResponse.json();
        return {
          ...recipe,
          sourceUrl: details.sourceUrl || "#"
        };
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(detailedRecipes)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 