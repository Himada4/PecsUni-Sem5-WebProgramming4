<script lang="ts">
	import type { DBRecipe } from '$lib/databaseManagement/DBInterfaces';

	export let recipe: DBRecipe;
	export let onClose: () => void;
	export let onSave: (updatedRecipe: DBRecipe) => void;


	let editableRecipe: DBRecipe = { ...recipe };

	function handleSubmit() {
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

		<div class="form-group">
			<label>Ingredients (JSON string)</label>
			<textarea bind:value={editableRecipe.ingredients}></textarea>
		</div>

		<div class="form-group">
			<label>Instructions</label>
			<textarea bind:value={editableRecipe.instructions}></textarea>
		</div>

		<div class="form-group">
			<label>Thumbnail URL</label>
			<input bind:value={editableRecipe.thumbnail_url} />
		</div>

		<div class="modal-buttons">
			<button class="save-btn" on:click={handleSubmit}>Save</button>
			<button class="cancel-btn" on:click={handleCancel}>Cancel</button>
		</div>
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		top: 0; left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(4px); /* nice subtle blur */
	}

	.modal {
		background: #ffffff;
		padding: 2rem;
		border-radius: 1rem;
		width: 90%;
		max-width: 500px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
		animation: fadeIn 0.3s ease;

		display: flex;
		flex-direction: column;
		align-items: center; /* Center content horizontally */
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
	}
	.form-group {
		margin-bottom: 1.2rem;
		width: 100%; /* Make form groups full width */
	}

	label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #555;
		text-align: left; /* Keep labels left aligned */
		width: 100%;
	}

	input, textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		font-size: 1rem;
		outline: none;
		transition: border-color 0.2s;
	}

	input:focus, textarea:focus {
		border-color: #0077cc;
	}

	textarea {
		min-height: 100px;
		resize: vertical;
	}

	.modal-buttons {
		display: flex;
		justify-content: center; /* Center buttons */
		gap: 1rem;
		margin-top: 2rem;
		width: 100%;
	}

	.modal-buttons button {
		padding: 0.6rem 1.4rem;
		font-size: 1rem;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s;
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

