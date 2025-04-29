<script lang="ts">
    import { onMount } from 'svelte';
    export let loggedIn: boolean;
    export let userId: string | undefined;
    let scrolled = false;
    import logo from '$lib/assets/logo.png';

    async function logout() {
        const res = await fetch('/api/session/logout', {
            method: 'POST'
        });

        if (res.ok) {
            window.location.href = '/';
        } else {
            console.error('Logout failed');
        }
    }

    onMount(() => {
        const handleScroll = () => {
            scrolled = window.scrollY > 0;
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Run once on load

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });
</script>

<nav class="navbar {scrolled ? 'scrolled' : ''}">
    <div class="left">
        <a href="/">Home</a>
        {#if loggedIn}
            <a href={`/user/${userId}`}>Profile</a>
            <button on:click={logout} class="link-button">Logout</button>
        {:else}
            <a href="/login">Login</a>
            <a href="/register">Register</a>
        {/if}
    </div>

    <div class="right">
        <img src={logo} alt="Website logo" style="height: 40px;" />
    </div>
</nav>

<style>
    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        padding: 1.5rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.1s ease;
        z-index: 1000;

    }

    .navbar.scrolled {
        background: rgba(96, 195, 227, 0.8); /* light blue with more solid */
        padding: 1rem 2rem; /* slightly smaller */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }

    .left a, .left button {
        margin-right: 1.5rem;
        text-decoration: none;
        color: #e4e6e6;
        font-weight: 600;

    }

    .left a:hover, .left button:hover {
        text-decoration: underline;
    }

    .link-button {
        background: none;
        border: none;
        color: inherit;
        font: inherit;
        cursor: pointer;
        padding: 0;
    }

    .right img {
        height: 40px;
    }
</style>