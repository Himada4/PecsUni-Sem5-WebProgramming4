<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';

    let userId: string | undefined;
    let username: string = 'Loading...';
    let joined: string = 'Loading...';
    let recipes: string[] = [];

    interface Recipe {
        recipeId: number;
        title: string;
        description: string;
        recipeCreated: string;
    }

    onMount(() => {
        userId = page.params.id;
        console.log('User ID from route params:', userId);
        if (userId) {
            fetchUserData(userId);
        }
    });

    async function fetchUserData(userId: string) {
        console.log(`Fetching data for userId: ${userId}`);
        try {
            const [userRes, recipesRes] = await Promise.all([
                fetch(`/api/users/${userId}`),
                fetch(`/api/users/${userId}/getUserRecipes`),
            ]);

            if (!userRes.ok || !recipesRes.ok) {
                console.error("Failed to fetch user data or recipes");
                return;
            }

            const userData = await userRes.json();
            const recipeData = recipesRes.ok ? await recipesRes.json() : [];

            console.log(userData);

            // Assign values based on fetched data
            username = userData.username;
            joined = userData.created_at;

            const recipesList = await Promise.all(recipeData.map(async (recipe: any) => {

                // Return a new object with title, description, and username
                return {
                    recipeId: recipe.recipe_id,  // Corrected: Use `recipe.recipe_id`
                    title: recipe.title,
                    description: recipe.description,
                    recipeCreated: recipe.created_at
                };
            }));
            recipes = recipes = recipesList.filter((recipe: any) => recipe !== null);

        } catch (error) {
            console.error("Error fetching user data:", error);
        }

    }
</script>

<main>
    <h1>User Profile</h1>

    <p><strong>User ID:</strong> {userId}</p>
    <p><strong>Username:</strong> {username}</p>
    <p><strong>Joined:</strong> {joined}</p>

    <h2>Recipes</h2>
    <ul>
        {#if recipes.length > 0}
            {#each recipes as recipe}
                <li>
                    <h3>
                        <a href={`/recipe/${recipe.recipeId}`}>{recipe.title}</a>
                    </h3>
                    <p>{recipe.description}</p>
                    <small>
                        Created on: {new Date(recipe.recipeCreated).toLocaleDateString()}
                    </small>
                </li>
            {/each}
        {:else}
            <li>This user hasn't submitted any recipes yet.</li>
        {/if}
    </ul>

</main>
