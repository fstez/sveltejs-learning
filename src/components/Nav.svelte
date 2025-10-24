<script>
	export let segment;

	import { goto, stores } from "@sapper/app";
	import { post } from "utils.js";

	const { session } = stores();

	async function logout() {
		try {
			await post("auth/logout"); // сервер гасит cookie/сессию
		} finally {
			// мгновенно обновляем UI на клиенте
			if (session && session.set) {
				session.set({ user: null });
			} else {
				// fallback (тоже сработает)
				$session.user = null;
			}
			goto("/");
		}
	}
</script>

<nav>
	<ul>
		{#if $session.user}
			<li>
				<a href="/" rel="home">Home</a>
			</li>
			<li>
				<a
					href="/overview"
					rel="overview"
					on:click|preventDefault={() => goto("/overview")}
					>Overview</a
				>
			</li>
			<li>
				<a
					rel="nofollow"
					href="/logout"
					on:click|preventDefault={logout}
					on:click|preventDefault={() => goto("/")}
				>
					Log out ({$session.user.username})
				</a>
			</li>
		{:else}
			<li>
				<a
					rel="prefetch"
					aria-current={segment === "login" ? "page" : undefined}
					href="/login">Log in</a
				>
			</li>
			<li>
				<a
					rel="prefetch"
					aria-current={segment === "register" ? "page" : undefined}
					href="/register">Register</a
				>
			</li>
		{/if}
	</ul>
</nav>

<style>
	nav {
		border-bottom: 1px solid rgba(255, 62, 0, 0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: "";
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: "";
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255, 62, 0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>
