<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import type { DBRecipe } from '$lib/databaseManagement/DBInterfaces';

    let userId: string | undefined;

    interface IRecipe {
        recipe_id: string;
        title: string;
        description: string;
        created_at: string;
    }

    interface IUser {
        username: string;
        joined: string;
    }

    let recipes: IRecipe[] = [];
    let user: IUser = {
        username: "Loading...",
        joined: "Loading..."
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

            user.username = userData.username;
            user.joined = userData.created_at;

            const recipesList = await Promise.all(recipeData.map(async (recipe: DBRecipe) => {
                return {
                    recipe_id: recipe.recipe_id,
                    title: recipe.title,
                    description: recipe.description,
                    created_at: recipe.created_at
                };
            }));
            recipes = recipesList.filter((recipe: IRecipe) => recipe !== null);

        } catch (error) {
            console.error("Error fetching user data:", error);
        }

    }
</script>

<main>
    <h1>User Profile</h1>

    <p><strong>User ID:</strong> {userId}</p>
    <p><strong>Username:</strong> {user.username}</p>
    <p><strong>Joined:</strong> {user.joined}</p>

    <h2>Recipes</h2>
    <ul>
        {#if recipes.length > 0}
            {#each recipes as recipe (recipe.recipe_id)}
                <li>
                    <h3>
                        <a href={`/recipe/${recipe.recipe_id}`}>{recipe.title}</a>
                    </h3>
                    <p>{recipe.description}</p>
                    <small>
                        Created on: {new Date(recipe.created_at).toLocaleDateString()}
                    </small>
                </li>
            {/each}
        {:else}
            <li>This user hasn't submitted any recipes yet.</li>
        {/if}
    </ul>

</main>
