<script lang="ts">
    export let value: string;
    export let placeholder: string = "Search recipes...";
    export let onInput: (event: Event) => void;
</script>

<div class="searchBarContainer">
    <input
            type="text"
            class="searchInput"
            bind:value
            placeholder={placeholder}
            on:input={onInput}
    />
</div>

<style>
    .searchBarContainer {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem;
        background-color: #f0e9e6;
    }

    .searchInput {
        flex: 1;
        max-width: 600px;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border-radius: 8px;
        border: 1px solid #ccc;
    }
</style>
