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
	<div class="login-container">
		<h1>Login</h1>

		{#if error}
			<p class="error">{error}</p>
		{/if}

		<form on:submit|preventDefault={handleLogin}>
			<label>
				Username
				<input type="text" bind:value={username} required />
			</label>

			<label>
				Password
				<input type="password" bind:value={password} required />
			</label>

			<button type="submit">Login</button>
		</form>
	</div>
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 80vh;
		padding: 2rem;
	}

	.login-container {
		background: #fff;
		padding: 2rem 3rem;
		border-radius: 1rem;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 400px;
		text-align: center;
	}

	h1 {
		margin-bottom: 1.5rem;
		font-size: 2rem;
		color: #333;
	}

	.error {
		color: #e63946;
		margin-bottom: 1rem;
		font-weight: bold;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		font-weight: 600;
		color: #555;
		width: 100%;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		margin-top: 0.3rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.3s;
	}

	input:focus {
		border-color: #3f88c5;
		outline: none;
	}

	button {
		margin-top: 1rem;
		padding: 0.75rem;
		font-size: 1rem;
		background-color: #3f88c5;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: #3377aa;
	}
</style>

