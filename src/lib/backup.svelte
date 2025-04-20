<script lang="ts">
    /*
    import { onMount } from "svelte";

    // Define arrays for users, recipes, and comments
    let users: any[] = [];
    let recipes: any[] = [];
    let comments: any[] = [];

    // Function to fetch users, recipes, and comments data
    async function getAll() {
        // Fetch users
        let res = await fetch("/api", {
            method: "GET",
        });
        users = await res.json();

        /a*
        // Fetch recipes
        res = await fetch("/recipe", {
            method: "GET",
        });
        recipes = await res.json();

        // Fetch comments
        res = await fetch("/comment", {
            method: "GET",
        });
        comments = await res.json();
        *a/

    }

    let username = "fgshdfsdhs";
    let email = "hahahaffhah";
    let total_score = 23; // optional

    async function addUser() {
        const res = await fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                total_score
            })
        });

        if (res.ok) {
            console.log("User added!");
            // optionally clear input fields or refetch user list here
        } else {
            console.error("Failed to add user");
        }
    }


    // Fetch the data when the component mounts
    onMount(() => {
        getAll();
    });
    */

    import Navbar from '$lib/components/Navbar.svelte';

    const customLinks = [
        { name: "Blog", href: "/blog" },
        { name: "Projects", href: "/projects" }
    ];
</script>

<!--
<main>
    <h1>Food Community</h1>

    <h2>Users</h2>
    <-- Render the users here ->
    <ul>
        {#each users as user (user.user_id)}
            <li>
                <strong>{user.username}</strong> ({user.email}) - Score: {user.total_score}
            </li>
        {/each}
    </ul>

    <h2>Recipes</h2>
    <-- Render the recipes here ->
    <ul>
        {#each recipes as recipe (recipe.recipe_id)}
            <li>
                <strong>{recipe.title}</strong> by {recipe.user_id} - {recipe.description}
            </li>
        {/each}
    </ul>

    <h2>Comments</h2>
    <-- Render the comments here ->
    <ul>
        {#each comments as comment (comment.comment_id)}
            <li>
                <strong>Recipe ID: {comment.recipe_id}</strong> - {comment.content}
            </li>
        {/each}
    </ul>

    <button onclick={async () => {
        await addUser();
        await getAll();
    }}>ADD</button>
</main>

<style>
    /* Add some basic styling if needed */
    main {
        padding: 20px;
    }
    ul {
        list-style-type: none;
    }
    li {
        padding: 5px;
        border: 1px solid #ccc;
        margin: 5px 0;
    }
    h1, h2 {
        color: #333;
    }
</style>
-->

<Navbar brand="CoolSite" links={customLinks} />

