<script context="module">
    export function preload(page, session) {
        const user = session && session.user;
        if (!user || !user.username) {
            this.redirect(302, "/login");
        }
    }
</script>

<script>
    import * as sapper from "@sapper/app";
    import { post } from "utils.js";

    const { session } = sapper.stores();

    async function getMyData() {
        return await post(`auth/getMyData`).then((r) => {
            if (r && r.accounts) {
                r.funds = r.accounts.reduce(
                    (funds, account) => funds + account.balance,
                    0,
                );
            }
            return r;
        });
    }

    async function getTransactions() {
        return await post(`auth/getTransactions`);
    }
</script>

<svelte:head>
    <title>Overview</title>
</svelte:head>

{#if process.browser}
    {#await getMyData()}
        loading...
    {:then my}
        <section>
            <h1 class="text-center">Overview</h1>
            <p style="font-size: xx-large">{my.name}</p>
        </section>
        <section>
            My funds
            <p
                style="font-size: xx-large; color:{my.funds > 0
                    ? 'green'
                    : 'red'}"
            >
                {my.funds}
            </p>
        </section>

        <section>
            <ul>
                {#each my.accounts as account}
                    <li>{account.number} ({account.name})</li>
                {/each}
            </ul>
        </section>
        <section>
            {#await getTransactions()}
                loading...
            {:then transactions}
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>SenderName</th>
                            <th>Amount</th>
                            <th>CreatedAt</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each transactions as transaction}
                            <tr>
                                <td><b>{transaction.senderName}</b></td>
                                <td
                                    style="color: {transaction.amount > 0
                                        ? 'green'
                                        : 'red'}"
                                    >{transaction.amount}
                                    {transaction.currency}</td
                                >
                                <td>{transaction.createdAt}</td>
                                <td><b>{transaction.status}</b></td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/await}
        </section>
    {/await}
{/if}

<style>
    section {
        margin: 1em 0;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th,
    td {
        padding: 0.5em;
        text-align: left;
        border: 1px solid #ccc;
    }
</style>
