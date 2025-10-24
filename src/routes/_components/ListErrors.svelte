<script>
    export let errors = null;
</script>

{#if errors}
    <ul class="error-messages">
        {#if typeof errors === "string"}
            <li>{errors}</li>
        {:else}
            {#each Object.keys(errors) as key}
                {#if Array.isArray(errors[key])}
                    {#each errors[key] as msg}
                        <li>{key} {msg}</li>
                    {/each}
                {:else}
                    <li>{key} {errors[key]}</li>
                {/if}
            {/each}
        {/if}
    </ul>
{/if}

<style>
    .error-messages {
        margin: 0 0 1rem 0;
        padding-left: 1.2rem;
        color: #b00020;
    }
</style>
