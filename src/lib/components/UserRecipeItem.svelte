
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
	<h3>
		<a href={`/recipe/${recipe.recipe_id}`}>{recipe.title}</a>
	</h3>
	<p>{recipe.description}</p>
	<small>
		Created on: {new Date(recipe.created_at).toLocaleDateString()}
	</small>

	{#if showControls}
		<div class="buttons">
			<button on:click={() => onEdit(recipe.recipe_id)}>Edit</button>
			<button on:click={() => onDelete(recipe.recipe_id)}>Delete</button>
		</div>
	{/if}
</li>

<style>
    .recipe-item {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        background-color: #f9f9f9;
        transition: box-shadow 0.2s;
    }

    .recipe-item:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .recipe-item h3 {
        margin: 0 0 0.5rem;
    }

    .recipe-item p {
        margin: 0 0 0.5rem;
        color: #444;
    }

    .recipe-item small {
        color: #777;
    }
</style>