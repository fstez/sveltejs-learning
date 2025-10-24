<!-- src/routes/login/index.svelte -->
<script context="module">
    // Sapper: preload(page, session). session приходит из sapper.middleware()
    export async function preload(page, session) {
        // если ты кладёшь в сессию user, как в /auth/login
        const user = session && session.user;
        if (user && user.username) {
            this.redirect(302, `/`);
        }

        // если вместо user ты хранишь только token:
        // const tok = session && session.token;
        // const uname = session && session.username; // или session.user?.username
        // if (tok && uname) this.redirect(302, `/profile/${uname}`);
    }
</script>

<script>
    import { goto, stores } from "@sapper/app";
    import ListErrors from "../_components/ListErrors.svelte";
    import { post } from "utils.js";

    const { session } = stores();

    let username = "";
    let password = "";
    let errors = null;

    async function submit() {
        const response = await post("auth/login", { username, password });

        errors = response.errors || null;

        if (response.user) {
            // Обновляем session на клиенте, чтобы navbar сразу поменялся
            $session = { user: response.user, token: response.token };

            // Перенаправляем
            goto(`/`);
        }
    }
</script>

<svelte:head>
    <title>Sign in</title>
</svelte:head>

<div class="auth-page">
    <div class="container page">
        <div class="row">
            <div class="col-md-6 offset-md-3 col-xs-12">
                <h1 class="text-xs-center">Sign In</h1>
                <p class="text-xs-center">
                    <a href="/register">Need an account?</a>
                </p>

                {#if errors}
                    <div class="alert alert-danger" role="alert">
                        <ListErrors {errors} />
                    </div>
                {/if}

                <form on:submit|preventDefault={submit}>
                    <fieldset class="form-group">
                        <input
                            class="form-control form-control-lg"
                            type="text"
                            required
                            placeholder="Username"
                            bind:value={username}
                        />
                    </fieldset>
                    <fieldset class="form-group">
                        <input
                            class="form-control form-control-lg"
                            type="password"
                            required
                            placeholder="Password"
                            bind:value={password}
                        />
                    </fieldset>
                    <button
                        class="btn btn-lg btn-primary pull-xs-right"
                        type="submit"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
