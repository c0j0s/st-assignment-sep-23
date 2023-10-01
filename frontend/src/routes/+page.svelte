<script lang="ts">
  import { onMount } from 'svelte';
  import axios, { type AxiosResponse } from 'axios';
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
  import { postFile } from '$lib/endpoint';

  let selectedFile: File | undefined;
  let isUploading: boolean = false;
  let uploadProgress: number = 0;
  let uploadedFiles: string[] = [];

  let showToast = false;
  let toastMessage = '';
  let toastType = 'default';

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      selectedFile = input.files[0];
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
  });
</script>

<Container size="xs" override={{ px: 'lg' }}>
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
          <Text size="lg">Uploaded Files</Text>
          <ul>
            {#each uploadedFiles as item}
              <li>
                <Text variant="link" root="a" href={`/data/${item}`}>
                  {item.slice(14)}
                </Text>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </Flex>
  </Card>
  <Toast message={toastMessage} visible={showToast} type={toastType} />
</Container>
