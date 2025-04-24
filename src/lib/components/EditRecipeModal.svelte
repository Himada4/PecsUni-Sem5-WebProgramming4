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

	<label>
		Title:
		<input bind:value={editableRecipe.title} />
	</label>

	<label>
		Description:
		<textarea bind:value={editableRecipe.description}></textarea>

	</label>

	<label>
		Ingredients (JSON string):
		<textarea bind:value={editableRecipe.ingredients}></textarea>
	</label>

	<label>
		Instructions:
		<textarea bind:value={editableRecipe.instructions}></textarea>
	</label>

	<label>
		Thumbnail URL:
		<input bind:value={editableRecipe.thumbnail_url} />
	</label>

	<div class="modal-buttons">
		<button on:click={handleSubmit}>Save</button>
		<button on:click={handleCancel}>Cancel</button>
	</div>
</div>
</div>


<style>
    .modal-backdrop {
        position: fixed;
        top: 0; left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal {
        background: white;
        padding: 2rem;
        border-radius: 0.5rem;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }

    label {
        display: block;
        margin: 1rem 0;
    }

    input, textarea {
        width: 100%;
        padding: 0.5rem;
        font-size: 1rem;
        margin-top: 0.25rem;
    }

    .modal-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
    }
</style>
