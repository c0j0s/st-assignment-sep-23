<script>
	import { SvelteUIProvider } from '@svelteuidev/core';
</script>


<SvelteUIProvider>
	<nav> 
		<a href="/">home</a>
	</nav>

    <slot/>
</SvelteUIProvider>