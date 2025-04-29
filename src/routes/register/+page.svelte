<script lang="ts">
	let username = '';
	let password = '';
	let error = '';
	let success = '';

	async function register() {
		error = '';
		success = '';

		if (!username || !password) {
			error = 'Username and password are required!';
			return;
		}

		try {
			// Sending the registration data to the backend API
			const response = await fetch('/api/session/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();

			if (response.ok) {
				success = data.message || 'Registration successful!';
			} else {
				error = data.message || 'Something went wrong. Try again.';
			}
		} catch (err) {
			console.error('Registration error:', err);
			error = 'Failed to register. Please try again later.';
		}

		success = 'Registration successful!';
	}
</script>

<main>
	<div class="register-container">
		<h1>Register</h1>

		<form on:submit|preventDefault={register}>
			<input type="text" bind:value={username} placeholder="Username" required />
			<input type="password" bind:value={password} placeholder="Password" required />
			<button type="submit">Register</button>
		</form>

		{#if error}
			<p class="error">{error}</p>
		{/if}

		{#if success}
			<p class="success">{success}</p>
		{/if}
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

	.register-container {
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

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	input {
		width: 100%;
		padding: 0.75rem;
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

	.error {
		color: #e63946;
		margin-top: 1rem;
		font-weight: bold;
	}

	.success {
		color: #2a9d8f;
		margin-top: 1rem;
		font-weight: bold;
	}
</style>

