<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import type { DBRecipe } from '$lib/databaseManagement/DBInterfaces';
    import UserRecipeItem from '$lib/components/UserRecipeItem.svelte';
    import EditRecipeModal from '$lib/components/EditRecipeModal.svelte';

    let userId: string | undefined;

    let selectedRecipe: DBRecipe | null = null;

    export let data: { isOwner: boolean };

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

<main class="user-container">
    <div class="user-content">
        {#if data.isOwner}
            <p class="owner-message">Welcome to <strong>your</strong> profile. You can edit your recipes!</p>
        {:else}
            <p class="visitor-message">You are visiting someone else's profile.</p>
        {/if}

        <h1>User Profile</h1>

        <div class="user-info">
            <p><strong>User ID:</strong> {userId}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Joined:</strong> {user.joined}</p>
        </div>

        <h2>Recipes</h2>
        <ul class="recipe-list">
            {#if recipes.length > 0}
                {#each recipes as recipe (recipe.recipe_id)}
                    <UserRecipeItem
                            {recipe}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            showControls={data.isOwner}
                    />
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
    </div>
</main>


<style>
    .user-container {
        width: 50%;
        margin: 4rem auto 0 auto;
        padding: 0 1rem;
    }

    .user-content {
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 2rem;
    }

    h1, h2 {
        text-align: center;
        margin-bottom: 2rem;
    }

    .owner-message, .visitor-message {
        text-align: center;
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
        color: #333;
    }

    .user-info {
        background: #f9f9f9;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 2rem;
    }

    .recipe-list {
        list-style: none;
        padding: 0;
    }

    .recipe-list li {
        background: #f0f8ff;
        margin-bottom: 1rem;
        padding: 1rem;
        border-radius: 8px;
    }

</style>
