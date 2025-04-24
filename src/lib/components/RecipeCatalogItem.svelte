<script lang="ts">
	export let recipe: {
		recipe_id: number;
		title: string;
		description: string;
		username: string;
		user_id: number;
		created_at: string;
	}

</script>

<div class="recipe-panel">
	<h3><a href={`/recipe/${recipe.recipe_id}`}>{recipe.title}</a></h3>
	<p>{recipe.description}</p>
	<small>
		Submitted by:
		<a href={`/user/${recipe.user_id}`}>{recipe.username}</a>
	</small>
	<br />
	<small>
		Created on: {new Date(recipe.created_at).toLocaleDateString()}
	</small>
</div>

<style>
    .recipe-panel {
        padding: 1rem;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
    }
</style>
