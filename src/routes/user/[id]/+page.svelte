<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import type { DBRecipe } from '$lib/databaseManagement/DBInterfaces';
    import UserRecipeItem from '$lib/components/UserRecipeItem.svelte';
    import EditRecipeModal from '$lib/components/EditRecipeModal.svelte';

    let userId: string | undefined;

    let isLoggedIn = true;

    let selectedRecipe: DBRecipe | null = null;

    interface IRecipe {
        recipe_id: number;
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

    async function handleDelete(id: number) {
        const confirmed = confirm("Are you sure you want to delete this recipe?");
        if (!confirmed) return;

        const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
        if (res.ok) {
            recipes = recipes.filter(r => r.recipe_id !== id);
        } else {
            const error = await res.json();
            alert("Failed to delete: " + error?.error);
        }
    }

    //EDIT RECIPE

    async function handleEdit(id: number) {
        try {
            const response = await fetch(`/api/recipes/${id}`);
            selectedRecipe = await response.json();
        } catch (error) {
            console.error('Failed to fetch recipe details:', error);
        }
    }

    async function handleSave(updatedRecipe: DBRecipe) {
        try {
            const response = await fetch(`/api/recipes/${updatedRecipe.recipe_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRecipe)
            });

            if (!response.ok) {
                console.error('Failed to update the recipe');
                return;
            }

            const updatedIRecipe: IRecipe = {
                recipe_id: updatedRecipe.recipe_id,
                title: updatedRecipe.title,
                description: updatedRecipe.description,
                created_at: updatedRecipe.created_at,
            };

            console.log("before", recipes);

            // Create a new array with the updated recipe to trigger reactivity
            recipes = [
                ...recipes.filter(r => r.recipe_id !== updatedIRecipe.recipe_id),
                updatedIRecipe // Add the updated recipe
            ];

            console.log("after", recipes);

        } catch (error) {
            console.error('Error saving the recipe:', error);
        } finally {
            handleCloseModal();
        }
    }


    function handleCloseModal() {
        selectedRecipe = null;
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
                <UserRecipeItem {recipe} onDelete={handleDelete} onEdit={handleEdit} showControls={isLoggedIn}/>
            {/each}
        {:else}
            <li>This user hasn't submitted any recipes yet.</li>
        {/if}
    </ul>

    {#if selectedRecipe}
        <EditRecipeModal
          recipe={selectedRecipe}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
    {/if}
</main>
