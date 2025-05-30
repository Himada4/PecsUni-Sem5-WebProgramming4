<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import * as BBCodeParser from 'bbcode';

    let recipeId: string | undefined;

    //DEBUG SWITCH (Since Spoonacular has 150 calls limit per day)
    const enable = true;

    interface IRecipe {
        recipe_id: number;
        title: string;
        description: string;
        ingredients: Record<string, string>;
        instructions: string;
        thumbnailUrl: string;
        user_id: number;
        username: string;
        recipeCreated: string;
    }

    interface Macronutrients {
        calories: number;
        protein: number;
        fat: number;
        carbohydrates: number;
        fiber: number;
        sugar: number;
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

    let calcStatus = 1;

    onMount(() => {
        recipeId = page.params.id;
        console.log('Recipe ID from route params:', recipeId);

        if (recipeId) {

            fetchRecipeData(recipeId);

        }
    });

    async function fetchRecipeData(recipeId: string) {
        calcStatus = 1;
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

            let formattedInstructions = "Loading..."
            BBCodeParser.parse(recipeData.instructions, function(content : string) {
                formattedInstructions = content;
            });

            recipe = {
                recipe_id: recipeData.recipe_id,
                title: recipeData.title,
                description: recipeData.description,
                ingredients: JSON.parse(recipeData.ingredients),
                instructions: formattedInstructions,
                thumbnailUrl: recipeData.thumbnail_url,
                user_id: userData.user_id,
                username: userData.username,
                recipeCreated: recipeData.created_at
            };
            await fetchRecipeNutrientFact(recipe);


        } catch (error) {
            console.error("[fetchRecipeData] Error fetching recipe data:", error);
            calcStatus = 2;
        }
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
                    unit = "";
                }
                // If amount has both number and unit
                else if (/\d+\s?[a-zA-Z]+/.test(amount)) {
                    // Match pattern: (number)(unit) or (number) (unit)
                    const match = amount.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
                    if (match) {
                        amt = Number(match[1]);
                        unit = match[2];
                    } else {
                        console.log(`Skipping ingredient "${ingredientName}" due to invalid amount format: ${amount}`);
                        continue;
                    }
                }
                // If amount is non-numeric and doesn't match acceptable patterns
                else {
                    console.log(`Skipping ingredient "${ingredientName}" due to unsupported amount: ${amount}`);
                    continue;
                }


                //console.log({ query, amt, unit });
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

                //console.log(infoData);

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

            // Expected units from Spoonacular API:
            // calories → kcal
            // protein, fat, carbohydrates, fiber, sugar → g
            totalNutrients.calories = round(totalNutrients.calories);
            totalNutrients.carbohydrates = round(totalNutrients.carbohydrates);
            totalNutrients.fat = round(totalNutrients.fat);
            totalNutrients.fiber = round(totalNutrients.fiber);
            totalNutrients.protein = round(totalNutrients.protein);
            totalNutrients.sugar = round(totalNutrients.sugar);
            calcStatus = 0;

        } catch (error) {
            console.error("Error fetching recipe nutrition facts:", error);
            calcStatus = 2;
        }

        console.log(recipeObject.ingredients);
    }

    function round(value: number, decimals: number = 2): number {
        return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }


</script>

<main class="recipe-container">
    {#if recipe}
        <h1>Recipe Details</h1>

        <div class="recipe-content">
            <h2>{recipe.title}</h2>
            <p><strong>Description:</strong> {recipe.description}</p>

            {#if recipe.thumbnailUrl?.endsWith('.mp4')}
                <video
                        src={recipe.thumbnailUrl}
                        autoplay
                        loop
                        muted
                        playsinline
                        class="recipe-media"
                ></video>
            {:else if recipe.thumbnailUrl}
                <img src={recipe.thumbnailUrl} alt="Recipe Thumbnail" class="recipe-media" />
            {/if}

            <h3>Ingredients:</h3>
            <ul>
                {#each Object.entries(recipe.ingredients) as [ingredient, amount] (ingredient)}
                    <li>{ingredient}: {amount}</li>
                {/each}
            </ul>

            <h3>Instructions:</h3>
            <p>{@html recipe.instructions}</p>

            <div class="submitted-info">
                <small>Submitted by: <a href={`/user/${recipe.user_id}`}>{recipe.username}</a></small>
                <br />
                <small>Created on: {new Date(recipe.recipeCreated).toLocaleDateString()}</small>
            </div>

            <h3>Nutritional Information:</h3>

            {#if calcStatus === 1}
                <p>Calculating nutrition...</p>
            {:else if calcStatus === 2}
                <p style="color: red;">An error occurred while calculating nutrition.</p>
            {:else}
                <div class="nutritional-facts">
                    <p><strong>Calories:</strong> {totalNutrients.calories} kcal</p>
                    <p><strong>Carbohydrates:</strong> {totalNutrients.carbohydrates} g</p>
                    <p><strong>Fat:</strong> {totalNutrients.fat} g</p>
                    <p><strong>Protein:</strong> {totalNutrients.protein} g</p>
                    <p><strong>Fiber:</strong> {totalNutrients.fiber} g</p>
                    <p><strong>Sugar:</strong> {totalNutrients.sugar} g</p>
                </div>
            {/if}
        </div>
    {/if}
</main>

<style>
    .recipe-container {
        width: 50%;
        margin: 4rem auto 0 auto;
        padding: 0 1rem;
    }

    .recipe-content {
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 2rem;
    }

    h1, h2, h3 {
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .recipe-media {
        display: block;
        margin: 2rem auto;
        max-width: 100%;
        border-radius: 8px;
    }

    ul {
        padding-left: 1.5rem;
        margin-bottom: 2rem;
    }

    .submitted-info {
        margin-top: 2rem;
        font-size: 0.9rem;
        color: #666;
    }

    .nutritional-facts {
        margin-top: 2rem;
        background: #f0f8ff;
        padding: 1rem;
        border-radius: 8px;
    }

</style>


