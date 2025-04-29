<script>
    export let isLoggedIn = false;
</script>

{#if isLoggedIn}
    <a href="/recipe/add" class="fab">
        +
    </a>
{/if}

<style>
    .fab {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background-color: #007BFF;
        color: white;
        font-size: 2rem;
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        transition: background-color 0.3s, transform 0.2s;
        z-index: 1000;
    }

    .fab:hover {
        background-color: #0056b3;
        transform: scale(1.1);
    }
</style>
