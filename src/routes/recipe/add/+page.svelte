<script lang="ts">
    import { page } from '$app/state';
    let isLoading = false;
    let resultMessage = "";

    let title = "";
    let description = "";
    let instructions = "";
    let thumbnailUrl = "";

    let ingredientName = "";
    let ingredientAmount = "";
    let ingredientsList: { name: string, amount: string }[] = [];




    function addIngredient() {
        if (ingredientName.trim() && ingredientAmount.trim()) {
            ingredientsList = [...ingredientsList, { name: ingredientName.trim(), amount: ingredientAmount.trim() }];
            ingredientName = "";
            ingredientAmount = "";
        }
    }

    function removeIngredient(index: number) {
        ingredientsList = ingredientsList.filter((_, i) => i !== index);
    }

    async function submitRecipe() {
        isLoading = true;
        resultMessage = "";

        const ingredientsObject = ingredientsList.reduce((acc, item) => {
            acc[item.name] = item.amount;
            return acc;
        }, {} as Record<string, string>);


        const newRecipe = {
            user_id: page.data.userId,
            title,
            description,
            ingredients: JSON.stringify(ingredientsObject),
            instructions,
            thumbnail_url: thumbnailUrl
        };

        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newRecipe)
            });

            const result = await response.json();

            if (response.ok) {
                resultMessage = "Recipe added successfully!";
                title = "";
                description = "";
                instructions = "";
                thumbnailUrl = "";
                ingredientsList = [];
            } else {
                resultMessage = `Error: ${result.message}`;
            }
        } catch (error) {
            resultMessage = "An error occurred while adding the recipe.";
            console.error(error);
        } finally {
            isLoading = false;
        }
    }
</script>

<main>
    <h1>Add a New Recipe</h1>

    <form on:submit|preventDefault={submitRecipe}>
        <label>
            Title:
            <input type="text" bind:value={title} placeholder="Recipe title" required />
        </label>

        <label>
            Description:
            <textarea bind:value={description} placeholder="Short description" required></textarea>
        </label>

        <label>
            Instructions:
            <textarea bind:value={instructions} placeholder="Step by step..." required></textarea>
        </label>

        <label>
            Thumbnail URL:
            <input type="url" bind:value={thumbnailUrl} placeholder="https://example.com/image.png" />
        </label>

        <h2>Ingredients</h2>
        <div class="ingredient-inputs">
            <input
                    type="text"
                    bind:value={ingredientName}
                    placeholder="Ingredient name (e.g., Sugar)"
            />
            <input
                    type="text"
                    bind:value={ingredientAmount}
                    placeholder="Amount (e.g., 200g)"
            />
            <button type="button" on:click={addIngredient}>Add Ingredient</button>
        </div>

        <ul class="ingredient-list">
            {#each ingredientsList as ingredient, index}
                <li>
                    {ingredient.name}: {ingredient.amount}
                    <button type="button" on:click={() => removeIngredient(index)}>Remove</button>
                </li>
            {/each}
        </ul>

        <button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Add Recipe"}
        </button>
    </form>

    {#if resultMessage}
        <p class="message">{resultMessage}</p>
    {/if}
</main>

<style>
    main {
        max-width: 600px;
        margin: 4rem auto;
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    h1 {
        text-align: center;
        margin-bottom: 2rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    label {
        display: flex;
        flex-direction: column;
        font-weight: bold;
        color: #333;
    }

    input, textarea {
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-top: 0.5rem;
    }

    .ingredient-inputs {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .ingredient-inputs input {
        flex: 1;
    }

    .ingredient-inputs button {
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem 1rem;
        cursor: pointer;
    }

    .ingredient-inputs button:hover {
        background-color: #218838;
    }

    .ingredient-list {
        list-style: none;
        padding: 0;
        margin-bottom: 1rem;
    }

    .ingredient-list li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8f9fa;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border-radius: 4px;
    }

    .ingredient-list button {
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        cursor: pointer;
    }

    .ingredient-list button:hover {
        background-color: #c82333;
    }

    button[type="submit"] {
        padding: 0.75rem;
        font-size: 1.1rem;
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 1rem;
        transition: background-color 0.3s;
    }

    button[type="submit"]:hover {
        background-color: #0056b3;
    }

    button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .message {
        text-align: center;
        margin-top: 1rem;
        font-size: 1.1rem;
    }
</style>
