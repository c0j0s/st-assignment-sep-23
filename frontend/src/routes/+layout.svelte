<script>
    import { Text, Container, SvelteUIProvider } from '@svelteuidev/core';
    import '../app.css';
</script>

<SvelteUIProvider>
    <nav class="p-4 drop-shadow-sm mb-10 border-b-2">
        <Text variant="link" root="a" href={`/`}>home</Text>
    </nav>

    <div class="container mx-auto h-full">
        <slot />
    </div>
</SvelteUIProvider>
