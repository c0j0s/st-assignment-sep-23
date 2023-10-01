<script lang="ts">
    import { onMount } from 'svelte';
    import { queryFileData } from '$lib/endpoint.js';
    import {
        Text,
        Paper,
        Flex,
        Button,
        Overlay,
        Box,
        Loader,
        Input,
        NumberInput,
        ActionIcon
    } from '@svelteuidev/core';
    import { MagnifyingGlass } from 'radix-icons-svelte';

    // server loaded data
    export let data;

    let isLoading: boolean = true;
    let tableContent: string[][] = [];
    let page: number = 1;
    let indexBase: number = page;
    let limit: number = 30;
    let totalContentCount: number = 542;
    let pageLimit: number = totalContentCount / limit;

    let paginationControl: NumberInput;

    async function fetchData(pg: number, kw: string = '') {
        isLoading = true;
        await queryFileData(
            data.fileId,
            kw,
            pg,
            limit,
            (content, count) => {
                tableContent = content;
                totalContentCount = count;
                indexBase = (page - 1) * limit;
                isLoading = false;
            },
            (err) => {
                console.error('Error fetching data:', err);
            }
        );
    }

    // React to page number
    $: if (page > 0) {
        fetchData(page, keyword);
    }

    // React to keyword
    let keyword: string = '';
    $: if (keyword !== '') {
        fetchData(1, keyword);
    }

    // React to totalContentCount changes
    $: {
        pageLimit = Math.ceil(totalContentCount / limit);
    }

    onMount(() => {
        // fetch data on load
        fetchData(page);
    });
</script>

<Paper class="pb-28">
    <Flex direction="column" gap="md">
        <Flex class="justify-between items-center">
            <Text size="lg" class="mb-4"
                >{data.fileName} with {totalContentCount} entries {keyword !==
                ''
                    ? 'containing keyword ' + keyword
                    : ''}</Text
            >
            <Input
                icon={MagnifyingGlass}
                placeholder="Search data"
                bind:value={keyword}
            />
        </Flex>
        <Box class="overflow-x-auto overflow-y-hidden">
            <table class="table-auto border-2">
                <thead>
                    <tr>
                        <th class="border-2">No.</th>
                        {#each data.header as item}
                            <th class="border-2 whitespace-nowrap">{item}</th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    <!-- Display file data -->
                    {#each tableContent as row, idx}
                        <tr>
                            <td class="border-2">{indexBase + idx + 1}</td>
                            {#each row as cell}
                                <td class="border-2 whitespace-nowrap"
                                    >{cell}</td
                                >
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>

            <!-- Table empty indicator -->
            {#if totalContentCount === 0}
                <div class="flex items-center justify-center w-full h-full p-4">
                    <Text class="text-center">No content available.</Text>
                </div>
            {/if}

            <!-- Loading overlay -->
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
        </Box>
    </Flex>
</Paper>

<!-- Bottom Pagination -->
{#if totalContentCount > limit}
    <Paper class="fixed bottom-0 w-full p-4">
        <Flex justify="center" gap="md" class="items-center">
            <ActionIcon
                variant="filled"
                on:click={() => paginationControl.decrement()}
                color="lime"
                size="lg">-</ActionIcon
            >
            <NumberInput
                bind:this={paginationControl}
                hideControls
                defaultValue={1}
                min={1}
                max={pageLimit}
                bind:value={page}
                step={1}
            />
            <ActionIcon
                variant="filled"
                on:click={() => paginationControl.increment()}
                color="blue"
                size="lg">+</ActionIcon
            >
        </Flex>
    </Paper>
{/if}
