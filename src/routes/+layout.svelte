<!-- src/routes/+layout.svelte -->
<script>
    import Navbar from '$lib/components/Navbar.svelte';
    import Background from '$lib/components/Background.svelte';
    import AddRecipeButton from '$lib/components/addRecipeButton.svelte';
    export let data;
    import { page } from '$app/state';
</script>

<Navbar loggedIn={data.loggedIn} userId={data.userId} />

<Background />

<AddRecipeButton isLoggedIn={page.data.isLoggedIn} />

<slot />


