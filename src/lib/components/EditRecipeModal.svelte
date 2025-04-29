<script lang="ts">
	import type { DBRecipe } from '$lib/databaseManagement/DBInterfaces';
	import BccodeNoticePanel from "$lib/components/BccodeNoticePanel.svelte";

	export let recipe: DBRecipe;
	export let onClose: () => void;
	export let onSave: (updatedRecipe: DBRecipe) => void;

	let editableRecipe: DBRecipe = { ...recipe };
	let ingredientsList: { name: string, amount: string }[] = [];
	let ingredientName = "";
	let ingredientAmount = "";

	$: if (recipe.ingredients) {
		try {
			const parsedIngredients: Record<string, unknown> = JSON.parse(recipe.ingredients);
			ingredientsList = Object.entries(parsedIngredients).map(([name, amount]) => ({
				name,
				amount: typeof amount === 'string' ? amount : String(amount)
			}));
		} catch (error) {
			console.error("Error parsing ingredients JSON:", error);
			ingredientsList = [];
		}
		editableRecipe = { ...recipe };
	}

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

	function handleSubmit() {
		editableRecipe.ingredients = JSON.stringify(
				ingredientsList.reduce((acc, item) => {
					acc[item.name] = item.amount;
					return acc;
				}, {} as Record<string, string>)
		);
		onSave(editableRecipe);
	}

	function handleCancel() {
		onClose();
	}
</script>

<div
		class="modal-backdrop"
		tabindex="0"
		role="button"
		aria-label="Close Modal"
		on:click|self={handleCancel}
		on:keydown={(e) => e.key === 'Escape' && handleCancel()}
>
	<div class="modal" role="dialog" aria-modal="true">
		<h2>Edit Recipe</h2>

		<div class="form-group">
			<label>Title</label>
			<input bind:value={editableRecipe.title} />
		</div>

		<div class="form-group">
			<label>Description</label>
			<textarea bind:value={editableRecipe.description}></textarea>
		</div>

		<BccodeNoticePanel/>

		<div class="form-group">
			<label>Instructions</label>
			<textarea bind:value={editableRecipe.instructions}></textarea>
		</div>

		<div class="form-group">
			<label>Thumbnail URL</label>
			<input bind:value={editableRecipe.thumbnail_url} />
		</div>

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
			{#each ingredientsList as ingredient, index (index)}
				<li>
					{ingredient.name}: {ingredient.amount}
					<button type="button" on:click={() => removeIngredient(index)}>Remove</button>
				</li>
			{/each}
		</ul>

		<div class="modal-buttons">
			<button class="save-btn" on:click={handleSubmit}>Save</button>
			<button class="cancel-btn" on:click={handleCancel}>Cancel</button>
		</div>
	</div>
</div>


<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(4px);
	}

	.modal {
		background: #ffffff;
		padding: 2rem;
		border-radius: 1rem;
		width: 90%;
		max-width: 500px;
		max-height: 90vh;
		overflow-y: auto;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
		animation: fadeIn 0.3s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	h2 {
		margin-top: 0;
		text-align: center;
		color: #333;
		font-size: 1.8rem;
		width: 100%;
		margin-bottom: 1.5rem;
		flex-shrink: 0;
	}

	.form-group {
		margin-bottom: 1.2rem;
		width: 100%;
		flex-shrink: 0;
	}

	label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #555;
		text-align: left;
		width: 100%;
		flex-shrink: 0;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		font-size: 1rem;
		outline: none;
		transition: border-color 0.2s;
		flex-shrink: 0;
	}

	input:focus,
	textarea:focus {
		border-color: #0077cc;
	}

	textarea {
		min-height: 100px;
		resize: vertical;
	}

	h2 + .ingredient-inputs,
	.form-group + .ingredient-inputs {
		margin-top: 1.5rem;
	}

	.ingredient-inputs {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		margin-bottom: 1rem;
		width: 100%;
		flex-shrink: 0;
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
		flex-shrink: 0;
	}

	.ingredient-inputs button:hover {
		background-color: #218838;
	}

	.ingredient-list {
		list-style: none;
		padding: 0;
		margin-bottom: 1rem;
		width: 100%;

	}

	.ingredient-list li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f8f9fa;
		padding: 0.5rem;
		margin-bottom: 0.5rem;
		border-radius: 4px;
		flex-shrink: 0;
	}

	.ingredient-list button {
		background-color: #dc3545;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
		flex-shrink: 0;
	}

	.ingredient-list button:hover {
		background-color: #c82333;
	}

	.modal-buttons {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 2rem;
		width: 100%;
		flex-shrink: 0;
	}

	.modal-buttons button {
		padding: 0.6rem 1.4rem;
		font-size: 1rem;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s;
		flex-shrink: 0;
	}

	.save-btn {
		background-color: #4caf50;
		color: white;
	}

	.save-btn:hover {
		background-color: #43a047;
	}

	.cancel-btn {
		background-color: #e0e0e0;
		color: #333;
	}

	.cancel-btn:hover {
		background-color: #d5d5d5;
	}
</style>