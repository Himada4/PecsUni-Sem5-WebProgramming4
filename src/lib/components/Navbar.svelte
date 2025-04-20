<script>
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation'; // Import `goto` for navigation

    // Create a store to manage logged-in status
    let isLoggedIn = writable(false);

    // Create reactive variables for username/password in the login panel
    let username = '';
    let password = '';

    // Track the visibility of the login panel
    let loginPanelVisible = writable(false);

    // Handle login button click
    async function handleLogin() {
        // For now, simulate login by toggling the logged-in status
        if (username && password) {
            isLoggedIn.set(true);
            loginPanelVisible.set(false); // Hide the login panel
            console.log('Logged in with:', username); // For debugging

            // Use `goto` to navigate to the profile page after login
            await goto(`/user/${username}`); // Redirect to the profile page (replace with actual user ID logic)
        }
    }

    // Handle logout
    function handleLogout() {
        isLoggedIn.set(false);
    }

    // Optional: Redirect to the registration page (simulate behavior)
    function handleRegisterRedirect() {
        // Use `goto` to navigate to the registration page
        goto('/register');
    }
</script>

<nav class="navbar">
    <div class="brand">MySite</div>
    <ul class="nav-links">
        <li><a href="/">Home</a></li>

        <!-- Profile link, changes behavior based on login state -->
        {#if $isLoggedIn}
            <li><a href="/user/{userId}">Profile</a></li>
        {:else}
            <li>
                <a href="javascript:void(0)" on:click={() => loginPanelVisible.set(true)}>Profile</a>
                {#if $loginPanelVisible}
                    <div class="login-popup">
                        <div>
                            <label for="username">Username:</label>
                            <input type="text" id="username" bind:value={username} />
                        </div>
                        <div>
                            <label for="password">Password:</label>
                            <input type="password" id="password" bind:value={password} />
                        </div>
                        <button on:click={handleLogin}>Login</button>
                        <button on:click={handleRegisterRedirect}>Register</button>
                    </div>
                {/if}
            </li>
        {/if}
    </ul>
</nav>

<!-- Optional: Logout button if logged in -->
{#if $isLoggedIn}
    <button on:click={handleLogout}>Logout</button>
{/if}

<style>
    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: #333;
        color: white;
    }

    .nav-links {
        list-style: none;
        display: flex;
        gap: 1rem;
    }

    .nav-links a {
        color: white;
        text-decoration: none;
    }

    .nav-links a:hover {
        text-decoration: underline;
    }

    /* Styling for the login panel */
    .login-popup {
        position: absolute;
        background-color: white;
        border: 1px solid #ccc;
        padding: 1rem;
        top: 50px;
        right: 10px;
        width: 200px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .login-popup input {
        padding: 5px;
        margin: 5px 0;
    }

    .login-popup button {
        padding: 5px;
        margin: 5px 0;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
    }

    .login-popup button:hover {
        background-color: #45a049;
    }
</style>
