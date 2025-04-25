<script lang="ts">
	let username = '';
	let password = '';
	let error: string | null = null;

	async function handleLogin() {
		error = null;

		const response = await fetch('/api/session/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, password })
		});

		if (response.ok) {
			//console.log("Logged in!");
			window.location.href = '/';
		} else {
			const result = await response.json();
			error = result.message || 'Login failed.';
		}
	}
</script>

<main>
	<h1>Login</h1>

	{#if error}
		<p style="color: red;">{error}</p>
	{/if}

	<form on:submit|preventDefault={handleLogin}>
		<label>
			Username:
			<input type="text" bind:value={username} required />
		</label>

		<label>
			Password:
			<input type="password" bind:value={password} required />
		</label>

		<button type="submit">Login</button>
	</form>
</main>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 300px;
        margin: 2rem auto;
    }
</style>
