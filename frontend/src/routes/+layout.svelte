<script>
  import { Text, Container, SvelteUIProvider } from '@svelteuidev/core';
</script>

<SvelteUIProvider>
  <nav>
    <Text variant="link" root="a" href={`/`}>home</Text>
  </nav>

  <slot />
</SvelteUIProvider>
