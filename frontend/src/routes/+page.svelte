<script lang="ts">
    import { onMount } from 'svelte';
    import {
        Button,
        Container,
        InputWrapper,
        Input,
        Flex,
        Card,
        Progress,
        Text
    } from '@svelteuidev/core';
    import Toast from '$lib/toast.svelte';
    import { getUploadedFiles, postFile } from '$lib/endpoint';

    let selectedFile: File | undefined;
    let isUploading: boolean = false;
    let uploadProgress: number = 0;
    let uploadedFiles: string[] = [];

    let showToast = false;
    let toastMessage = '';
    let toastType = 'default';

    function handleFileChange(event: Event) {
        let input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            selectedFile = input.files[0];
            input.files = null;
        }
    }

    async function uploadFile() {
        isUploading = true;
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            await postFile(
                formData,
                (progress: number) => {
                    uploadProgress = progress;
                },
                (message: string, fileName: string) => {
                    showToastMessage(message, 'success');
                    uploadedFiles = [...uploadedFiles, fileName];
                    uploadProgress = 0;
                    selectedFile = undefined;
                },
                (err: string) => {
                    showToastMessage('File upload failed.', 'error');
                }
            );
        } else {
            showToastMessage('No file selected.', 'error');
        }
        isUploading = false;
    }

    async function loadFileList() {
        await getUploadedFiles(
            (files) => {
                uploadedFiles = [...uploadedFiles, ...files];
            },
            (err) => {
                console.log(err);
            }
        );
    }

    function showToastMessage(message: string, type: string = 'default') {
        toastMessage = message;
        showToast = true;
        toastType = type;

        if (type !== 'loading') {
            setTimeout(() => {
                showToast = false;
            }, 5000);
        }
    }

    onMount(() => {
        uploadProgress = 0;
        loadFileList();
    });
</script>

<Container size="xs" override={{ px: 'lg' }}>
    <Toast message={toastMessage} visible={showToast} type={toastType} />
    <Card shadow="sm" padding="lg">
        <Flex direction="column" gap="md">
            <InputWrapper
                label="Upload CSV File"
                description="only .csv files accepted."
                disabled={isUploading}
                required
            >
                <Input type="file" accept=".csv" on:change={handleFileChange} />
            </InputWrapper>

            <Button variant="light" color="blue" fullSize on:click={uploadFile}>
                Upload
            </Button>

            {#if isUploading}
                <Progress
                    value={uploadProgress}
                    label={uploadProgress}
                    size="xl"
                    striped
                    animate
                />
            {/if}

            {#if uploadedFiles.length > 0}
                <div>
                    <Text size="lg" class="p-2">Uploaded Files</Text>
                    <ul>
                        {#each uploadedFiles as item, idx}
                            <li class="p-2">
                                <Text
                                    variant="link"
                                    root="a"
                                    href={`/data/${item}`}
                                >
                                    {idx + 1}. {item.slice(14)}
                                </Text>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/if}
        </Flex>
    </Card>
</Container>
