<!-- src/routes/+layout.svelte -->
<script>
    import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar /> <!-- Navbar is rendered in all pages -->

<slot /> <!-- This is where the page content will go -->
