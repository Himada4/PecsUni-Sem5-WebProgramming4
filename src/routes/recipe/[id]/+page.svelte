<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import * as BBCodeParser from 'bbcode';


    let recipeId: string | undefined;

    interface IRecipe {
        recipeId: number;
        title: string;
        description: string;
        ingredients: Record<string, string>;
        instructions: string;
        thumbnailUrl: string;
        userId: number;
        username: string;
        recipeCreated: string;
    }

    const totalNutrients: Macronutrients = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0,
        fiber: 0,
        sugar: 0
    };


    let recipe: IRecipe;

    // When the component mounts, fetch the recipe details using the recipeId from the URL
    onMount(() => {
        recipeId = page.params.id;  // Get recipeId from the URL params
        console.log('Recipe ID from route params:', recipeId);

        if (recipeId) {
            fetchRecipeData(recipeId);
        }
    });

    async function fetchRecipeData(recipeId: string) {
        console.log(`[fetchRecipeData] Fetching data for recipeId: ${recipeId}`);
        try {
            const recipeRes = await fetch(`/api/recipes/${recipeId}`);
            if (!recipeRes.ok) {
                console.error("[fetchRecipeData] Failed to fetch recipe data");
                return;
            }

            const recipeData = await recipeRes.json();

            const userRes = await fetch(`/api/users/${recipeData.user_id}`);
            if (!userRes.ok) {
                console.error(`[fetchRecipeData] Failed to fetch user with ID: ${recipeData.user_id}`);
                return;
            }

            const userData = await userRes.json();

            let formattedInstructions = "loading"
            BBCodeParser.parse(recipeData.instructions, function(content : string) {
                formattedInstructions = content;
                //console.log("Parsed Instructions:", formattedInstructions);
            });

            // Assign formatted recipe object
            recipe = {
                recipeId: recipeData.recipe_id,
                title: recipeData.title,
                description: recipeData.description,
                ingredients: JSON.parse(recipeData.ingredients),
                instructions: formattedInstructions,
                thumbnailUrl: recipeData.thumbnail_url,
                userId: userData.user_id,
                username: userData.username,
                recipeCreated: recipeData.created_at
            };
            //console.log(recipe);
            await fetchRecipeNutrientFact(recipe);


        } catch (error) {
            console.error("[fetchRecipeData] Error fetching recipe data:", error);
        }
    }

    const enable = false;

    interface Macronutrients {
        calories: number;
        protein: number;
        fat: number;
        carbohydrates: number;
        fiber: number;
        sugar: number;
    }

    async function fetchRecipeNutrientFact(recipeObject: IRecipe) {

        const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;



        try {

            for (const [ingredientName, amount] of Object.entries(recipeObject.ingredients)) {
                const query = ingredientName;
                let id, amt, unit;

                // Check if amount is missing, empty, or not meaningful (like "to taste")
                if (!amount || isNaN(parseFloat(amount)) && !/\d/.test(amount)) {
                    console.log(`Skipping ingredient "${ingredientName}" due to non-numeric or undefined amount: ${amount}`);
                    continue;
                }

                // If amount is only a number (like "2")
                if (!isNaN(Number(amount))) {
                    amt = Number(amount);
                    unit = "";  // No unit provided
                }
                // If amount has both number and text
                else if (/\d+\s?[a-zA-Z]+/.test(amount)) {
                    // Match pattern: (number)(unit) or (number) (unit)
                    const match = amount.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
                    if (match) {
                        amt = Number(match[1]);
                        unit = match[2];
                    } else {
                        // Skip if format is invalid
                        console.log(`Skipping ingredient "${ingredientName}" due to invalid amount format: ${amount}`);
                        continue;
                    }
                }
                // If amount is non-numeric and doesn't match acceptable patterns
                else {
                    console.log(`Skipping ingredient "${ingredientName}" due to unsupported amount: ${amount}`);
                    continue;
                }


                console.log({ query, amt, unit });
                const searchURL= !enable ? "" : `https://api.spoonacular.com/food/ingredients/search?apiKey=${apiKey}&query=${query}`;
                const searchRes = await fetch(searchURL);
                const searchData = await searchRes.json();

                if (searchData.results && searchData.results.length > 0) {
                    id = searchData.results[0].id;
                    console.log(`Found ingredient ID for "${query}": ${id}`);
                } else {
                    console.log(`No matches found for ingredient: "${query}"`);
                    continue;
                }

                const infoURL = !enable ? "" : `https://api.spoonacular.com/food/ingredients/${id}/information?apiKey=${apiKey}&amount=${amt}${unit ? `&unit=${unit}` : ''}`;
                const infoRes = await fetch(infoURL);
                const infoData = await infoRes.json();

                console.log(infoData);

                const nutrients = infoData.nutrition.nutrients;

                for (const nutrient of nutrients) {
                    switch (nutrient.name) {
                        case "Calories":
                            totalNutrients.calories += nutrient.amount;
                            break;
                        case "Protein":
                            totalNutrients.protein += nutrient.amount;
                            break;
                        case "Fat":
                            totalNutrients.fat += nutrient.amount;
                            break;
                        case "Carbohydrates":
                            totalNutrients.carbohydrates += nutrient.amount;
                            break;
                        case "Fiber":
                            totalNutrients.fiber += nutrient.amount;
                            break;
                        case "Sugar":
                            totalNutrients.sugar += nutrient.amount;
                            break;
                    }
                }
            }

            console.log("Total Macronutrients for this recipe:", totalNutrients);
            // Expected units from Spoonacular API:
            // calories → kcal
            // protein, fat, carbohydrates, fiber, sugar → g
            totalNutrients.calories = round(totalNutrients.calories);
            totalNutrients.carbohydrates = round(totalNutrients.carbohydrates);
            totalNutrients.fat = round(totalNutrients.fat);
            totalNutrients.fiber = round(totalNutrients.fiber);
            totalNutrients.protein = round(totalNutrients.protein);
            totalNutrients.sugar = round(totalNutrients.sugar);
            console.log("Total Macronutrients for this recipe:", totalNutrients);



        } catch (error) {
            console.error("Error fetching recipe nutrition facts:", error);
        }

        console.log(recipeObject.ingredients);
    }

    function round(value: number, decimals: number = 2): number {
        return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }




</script>

<main>
    {#if recipe}
        <h1>Recipe Details</h1>

        <h2>{recipe.title}</h2>
        <p><strong>Description:</strong> {recipe.description}</p>

        {#if recipe.thumbnailUrl}
            <img src={recipe.thumbnailUrl} alt="Recipe Thumbnail" width="200" />
        {/if}

        <h3>Ingredients:</h3>
        <ul>
            {#each Object.entries(recipe.ingredients) as [ingredient, amount]}
                <li>{ingredient}: {amount}</li>
            {/each}
        </ul>

        <h3>Instructions:</h3>
        <p>{@html recipe.instructions}</p>

        <small>Submitted by: <a href={`/user/${recipe.userId}`}>{recipe.username}</a></small>

        <small>Created on: {new Date(recipe.recipeCreated).toLocaleDateString()}</small>

        <!-- Nutritional Facts Panel -->
        <h3>Nutritional Information:</h3>
        <div class="nutritional-facts">
            <p><strong>Calories:</strong> {totalNutrients.calories} kcal</p>
            <p><strong>Carbohydrates:</strong> {totalNutrients.carbohydrates} g</p>
            <p><strong>Fat:</strong> {totalNutrients.fat} g</p>
            <p><strong>Protein:</strong> {totalNutrients.protein} g</p>
            <p><strong>Fiber:</strong> {totalNutrients.fiber} g</p>
            <p><strong>Sugar:</strong> {totalNutrients.sugar} g</p>
        </div>
    {/if}
</main>


