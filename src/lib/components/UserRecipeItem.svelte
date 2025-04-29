
<script lang="ts">
	export let recipe: {
		recipe_id: number;
		title: string;
		description: string;
		created_at: string;
	};

	export let onDelete: (id: number) => void;
	export let onEdit: (id: number) => void;

	export let showControls: boolean = false;
</script>

<li class="recipe-item">
	<div class="recipe-header">
		<h3>
			<a href={`/recipe/${recipe.recipe_id}`}>{recipe.title}</a>
		</h3>
		<small>Created on: {new Date(recipe.created_at).toLocaleDateString()}</small>
	</div>

	<p class="recipe-description">{recipe.description}</p>

	{#if showControls}
		<div class="recipe-buttons">
			<button class="edit-btn" on:click={() => onEdit(recipe.recipe_id)}>Edit</button>
			<button class="delete-btn" on:click={() => onDelete(recipe.recipe_id)}>Delete</button>
		</div>
	{/if}
</li>

<style>
	.recipe-item {
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		background-color: #ffffff;
		transition: box-shadow 0.2s, transform 0.2s;
	}

	.recipe-item:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		transform: translateY(-2px);
	}

	.recipe-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.recipe-header h3 {
		margin: 0;
		font-size: 1.4rem;
	}

	.recipe-header a {
		text-decoration: none;
		color: #0077cc;
	}

	.recipe-header a:hover {
		text-decoration: underline;
	}

	.recipe-description {
		color: #555;
		margin-bottom: 1rem;
		font-size: 1rem;
	}

	.recipe-buttons {
		display: flex;
		gap: 1rem;
	}

	.recipe-buttons button {
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.edit-btn {
		background-color: #4caf50;
		color: white;
	}

	.edit-btn:hover {
		background-color: #43a047;
	}

	.delete-btn {
		background-color: #f44336;
		color: white;
	}

	.delete-btn:hover {
		background-color: #e53935;
	}

	small {
		font-size: 0.85rem;
		color: #888;
	}
</style>
