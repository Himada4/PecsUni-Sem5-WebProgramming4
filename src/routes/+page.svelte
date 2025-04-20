<script lang="ts">
    import { onMount } from 'svelte';

    interface Recipe {
        recipeId: number;
        title: string;
        description: string;
        username: string;
        userId: number;
        recipeCreated: string;
    }

    let recipes: Recipe[] = [];

    // Fetch data when the component mounts
    onMount(async () => {
        try {
            // Fetch all recipes first
            const res = await fetch('/api/recipes', {
                method: 'GET'  // Explicitly specify that this is a GET request
            });

            if (!res.ok) {
                console.error("Failed to fetch recipes");
                return;
            }

            const data = await res.json();

            // Now for each recipe, fetch the user's username
            const recipesWithUsernames = await Promise.all(data.map(async (recipe: any) => {
                const userRes = await fetch(`/api/users/${recipe.user_id}`);

                if (!userRes.ok) {
                    console.error(`Failed to fetch user with ID: ${recipe.user_id}`);
                    return null;  // Handle the case where user info fails
                }

                const userData = await userRes.json();

                // Return a new object with title, description, and username
                return {
                    recipeId: recipe.recipe_id,  // Corrected: Use `recipe.recipe_id`
                    title: recipe.title,
                    description: recipe.description,
                    username: userData.username,  // Use the actual username
                    userId: userData.user_id,
                    recipeCreated: recipe.created_at
                };
            }));

            // Filter out any null values in case of user fetch failure
            recipes = recipesWithUsernames.filter((recipe: any) => recipe !== null);
            console.log(recipes);  // For debugging

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });
</script>

<ul>
    {#each recipes as recipe}
        <li>
            <h3><a href={`/recipe/${recipe.recipeId}`}>{recipe.title}</a></h3>
            <p>{recipe.description}</p>
            <small>
                Submitted by:
                <a href={`/user/${recipe.userId}`}>{recipe.username}</a>
            </small>
            <small>Created on: {new Date(recipe.recipeCreated).toLocaleDateString()}</small>
        </li>
    {/each}
</ul>
