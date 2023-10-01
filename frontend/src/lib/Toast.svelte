<script lang="ts">
    import { Notification } from "@svelteuidev/core";
    import { Check, Cross2 } from "radix-icons-svelte";
    export let message = "";
    export let visible = false;
    export let type: string = "default";

    function closeToast() {
        visible = false;
    }
</script>

{#if visible}
    {#if type === "loading"}
        <Notification loading withCloseButton={false}>
            {message}
        </Notification>
    {:else if type === "success"}
        <Notification
            icon={Check}
            color="teal"
            withCloseButton={true}
            on:close={closeToast}
        >
            {message}
        </Notification>
    {:else if type === "error"}
        <Notification
            icon={Cross2}
            color="red"
            withCloseButton={true}
            on:close={closeToast}
        >
            {message}
        </Notification>
    {:else}
        <Notification withCloseButton={true} on:close={closeToast}>
            {message}
        </Notification>
    {/if}
{/if}
