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
	<h3 class="recipe-title">
		<a href={`/recipe/${recipe.recipe_id}`}>{recipe.title}</a>
	</h3>
	<p class="recipe-description">{recipe.description}</p>
	<div class="recipe-meta">
		<small>
			Submitted by
			<a href={`/user/${recipe.user_id}`}>{recipe.username}</a>
		</small>
		<small>
			• Created on {new Date(recipe.created_at).toLocaleDateString()}
		</small>
	</div>
</div>

<style>
	.recipe-panel {
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		background-color: #f0fbfb;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.recipe-panel:hover {
		transform: translateY(-3px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
	}

	.recipe-title a {
		text-decoration: none;
		color: #333;
		font-weight: bold;
		font-size: 1.5rem;
	}

	.recipe-title a:hover {
		color: #0077cc;
	}

	.recipe-description {
		color: #666;
		margin: 0.5rem 0 1rem 0;
		line-height: 1.4;
	}

	.recipe-meta {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
		color: #999;
	}

	.recipe-meta a {
		text-decoration: none;
		color: #0077cc;
		font-weight: 500;
	}

	.recipe-meta a:hover {
		text-decoration: underline;
	}
</style>

