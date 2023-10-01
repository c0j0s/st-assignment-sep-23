<script lang="ts">
    import { onMount } from 'svelte';
    import { loadPage } from '$lib/endpoint.js';
    import {
        Text,
        Paper,
        Flex,
        Button,
        Overlay,
        Box,
        Loader
    } from '@svelteuidev/core';
    export let data;
    let isLoading: boolean = true;
    let tableContent: string[][] = [];
    let page: number = 1;
    let limit: number = 30;
    let pageLimit: number = data.contentCount / limit;

    async function fetchData() {
        isLoading = true;
        try {
            console.log('Load initial');
            await loadPage(data.fileId, 1, limit, (content) => {
                tableContent = content;
                isLoading = false;
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function loadPrev() {
        isLoading = true;
        try {
            console.log('Go prev');
            await loadPage(data.fileId, page - 1, limit, (content) => {
                tableContent = content;
                page--;
                isLoading = false;
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function loadNext() {
        isLoading = true;
        try {
            console.log('Go next');
            await loadPage(data.fileId, page + 1, limit, (content) => {
                tableContent = content;
                page++;
                isLoading = false;
            });
        } catch (error) {
            console.log(error);
        }
    }

    onMount(() => {
        // load data on load
        fetchData();
    });
</script>

<Paper>
    <Flex direction="column" gap="md">
        <Flex>
            <Text size="lg" class="mb-4">{data.fileName}</Text>
        </Flex>
        <Box class="overflow-x-auto overflow-y-hidden">
            <table class="table-auto">
                <thead>
                    <tr>
                        <th>No.</th>
                        {#each data.header as item}
                            <th>{item}</th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each tableContent as row, idx}
                        <tr>
                            <td>{(page - 1) * limit + idx + 1}</td>
                            {#each row as cell}
                                <td>{cell}</td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>

                {#if isLoading}
                    <Overlay
                        opacity={0.6}
                        color="#000"
                        zIndex={5}
                        class="fixed top-0 right-0 bottom-0 left-0"
                    >
                        <div class="flex items-center justify-center h-screen">
                            <Loader />
                        </div>
                    </Overlay>
                {/if}
            </table>
            <Flex justify="center" gap="md">
                {#if page != 1}
                    <Button on:click={loadPrev}>Prev</Button>
                {/if}
                {#if page < pageLimit}
                    <Button on:click={loadNext}>Next</Button>
                {/if}
            </Flex>
        </Box>
    </Flex>
</Paper>
