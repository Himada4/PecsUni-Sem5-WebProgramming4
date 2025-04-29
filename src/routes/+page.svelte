<script lang="ts">
    import { onMount } from 'svelte';
    import RecipeCatalogItem from '$lib/components/RecipeCatalogItem.svelte';
    import type { DBRecipe } from '$lib/databaseManagement/DBInterfaces';

    interface IRecipe {
        recipe_id: number;
        title: string;
        description: string;
        username: string;
        user_id: number;
        created_at: string;
    }

    let recipes: IRecipe[] = [];

    export let data: { isLoggedIn: boolean };

    onMount(async () => {
        try {

            const res = await fetch('/api/recipes', {
                method: 'GET'
            });

            if (!res.ok) {
                console.error("Failed to fetch recipes");
                return;
            }

            const resData = await res.json();

            const recipesWithUsernames = await Promise.all(resData.map(async (recipe: DBRecipe) => {
                const userRes = await fetch(`/api/users/${recipe.user_id}`);

                if (!userRes.ok) {
                    console.error(`Failed to fetch user with ID: ${recipe.user_id}`);
                    return null;
                }

                const userData = await userRes.json();

                return {
                    recipe_id: recipe.recipe_id,
                    title: recipe.title,
                    description: recipe.description,
                    username: userData.username,
                    user_id: userData.user_id,
                    created_at: recipe.created_at
                };
            }));

            recipes = recipesWithUsernames.filter((recipe: IRecipe) => recipe !== null);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });
</script>

<div class="catalogContainer">
    <div class="catalogContent">
        <h1>Welcome {data.isLoggedIn ? 'back!' : 'guest!'}</h1>
        <div class="recipeListContainer">
            {#each recipes as recipe (recipe.recipe_id)}
                <RecipeCatalogItem {recipe} />
            {/each}
        </div>
    </div>
</div>

<style>
    .catalogContainer {
        margin-top: 4rem;
        display: flex;
        justify-content: center;
    }

    .catalogContent {
        width: 50%;
        max-width: 800px;

        background: #e1dad7;
    }

    .recipeListContainer {
        padding: 0 1rem;
    }


    .catalogContent h1 {
        text-align: center;
        background: #855b49;
        margin: 0 0 2rem 0;
        color: white;
        font-weight: 550;
    }

</style>





