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
			const response = await fetch('/api/users', {
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

		// Mock successful response for now
		success = 'Registration successful!';
	}
</script>

<main>
	<h1>Register</h1>

	<form on:submit|preventDefault={register}>
		<input type="text" bind:value={username} placeholder="Username" required />
		<input type="password" bind:value={password} placeholder="Password" required />
		<button type="submit">Register</button>
	</form>

	{#if error}
		<p style="color: red;">{error}</p>
	{/if}

	{#if success}
		<p style="color: green;">{success}</p>
	{/if}
</main>
