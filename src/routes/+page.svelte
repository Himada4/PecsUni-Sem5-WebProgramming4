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

    onMount(async () => {
        try {
            console.log("hi this is " + data.user_id);

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
<!--    <h1>Hello {data.user_id ? 'friend' : 'stranger'}!</h1>-->
    {#each recipes as recipe (recipe.recipe_id)}
        <RecipeCatalogItem {recipe} />
    {/each}
</div>


