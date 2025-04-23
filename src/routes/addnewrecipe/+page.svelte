<script lang="ts">
	let isLoading = false;
	let resultMessage = "";

	// The recipe object to be sent
	const newRecipe = {
		user_id: 3,
		title: "Spaghetti Bolognese",
		description: "A hearty Italian pasta dish",
		ingredients: JSON.stringify({
			"Spaghetti": "200g",
			"Ground Beef": "250g",
			"Tomato Sauce": "1 cup",
			"Onion": "1 medium",
			"Garlic": "2 cloves",
			"Salt": "to taste",
			"Pepper": "to taste"
		}),
		instructions: "[b]Step 1:[/b] Boil spaghetti. [b]Step 2:[/b] Cook beef with sauce.",
		thumbnail_url: "https://example.com/image.jpg"
	};

	async function submitRecipe() {
		isLoading = true;
		resultMessage = "";

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
	<h1>Test Add Recipe API</h1>

	<!-- Button to submit the recipe -->
	<button on:click={submitRecipe} disabled={isLoading}>
		{isLoading ? "Adding..." : "Add Recipe"}
	</button>

	<!-- Show the result message -->
	{#if resultMessage}
		<p>{resultMessage}</p>
	{/if}
</main>

<style>
    main {
        text-align: center;
        margin-top: 50px;
    }

    button {
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
    }

    button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    p {
        margin-top: 20px;
        font-size: 18px;
        color: green;
    }
</style>
